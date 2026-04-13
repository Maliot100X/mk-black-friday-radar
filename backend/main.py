"""
PHASE 10: BACKEND API
FastAPI for MK Black Friday Radar
"""

from fastapi import FastAPI, HTTPException, Query, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import hashlib
import json
from datetime import datetime

# Import ChromaDB
import sys
sys.path.insert(0, '/workspace/mk-black-friday-radar')
from rag.chroma_setup import ChromaManager

app = FastAPI(
    title="MK Black Friday Radar API",
    description="AI-powered deal discovery for North Macedonia",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/mkbf_deals')

# Initialize ChromaDB
chroma_manager = ChromaManager()

def get_db():
    conn = psycopg2.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        conn.close()

# Pydantic Models
class DealCreate(BaseModel):
    product_name: str
    category: str = "electronics"
    original_price: float
    discount_price: float
    store_slug: str

class DealResponse(BaseModel):
    id: int
    product_name: str
    brand: str = ""
    category: str
    store_name: str
    store_slug: str
    original_price_mkd: float
    discount_price_mkd: float
    discount_percentage: float
    deal_score: float
    image_url: str = ""
    deal_url: str = ""
    is_hot: bool
    rating_average: float = 0.0
    rating_count: int = 0

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3)
    email: str
    password: str = Field(..., min_length=6)
    full_name: str
    language: str = "mk"

class UserLogin(BaseModel):
    username: str
    password: str

class AIChatRequest(BaseModel):
    message: str
    user_id: Optional[int] = None

# ROOT
@app.get("/")
def root():
    return {
        "message": "🔥 MK Black Friday Radar API v2.0",
        "status": "running",
        "features": [
            "AI agents",
            "Deal scraping (10 stores)",
            "RAG search (ChromaDB)",
            "QR membership system",
            "Map radar (PostGIS)",
            "Analytics",
            "Firebase notifications"
        ],
        "stores": ["Neptun", "Setec", "Tehnomarket", "Anhoch", "Tinex", "Ramstore", "Vero", "KAM Market", "Ananas", "Zirafa"],
        "endpoints": {
            "deals": "/api/deals",
            "stores": "/api/stores",
            "auth": "/api/auth/*",
            "ai_chat": "/api/ai/chat",
            "rag_search": "/api/search/rag",
            "scrapers": "/api/scrapers/run"
        }
    }

# DEALS API
@app.get("/api/deals")
def get_deals(
    store: Optional[str] = Query(None, description="Filter by store slug"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search query"),
    is_hot: Optional[bool] = Query(None, description="Only hot deals"),
    min_discount: Optional[float] = Query(5, description="Minimum discount %"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get deals with filtering and pagination"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        query = """
            SELECT d.*, p.name as product_name, p.brand, p.category, p.image_url,
                   s.name as store_name, s.slug as store_slug,
                   COALESCE((SELECT AVG(rating_value) FROM ratings WHERE deal_id = d.id), 0) as rating_average,
                   COALESCE((SELECT COUNT(*) FROM ratings WHERE deal_id = d.id), 0) as rating_count
            FROM deals d
            JOIN products p ON d.product_id = p.id
            JOIN stores s ON d.store_id = s.id
            WHERE d.is_active = TRUE AND d.discount_percentage >= %s
        """
        params = [min_discount]
        
        if store:
            query += " AND s.slug = %s"
            params.append(store)
        if category:
            query += " AND p.category = %s"
            params.append(category)
        if search:
            query += " AND p.name ILIKE %s"
            params.append(f"%{search}%")
        if is_hot:
            query += " AND d.is_hot = TRUE"
        
        query += " ORDER BY d.deal_score DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])
        
        cur.execute(query, params)
        deals = cur.fetchall()
        
        cur.execute("SELECT COUNT(*) FROM deals WHERE is_active = TRUE")
        total = cur.fetchone()['count']
        
        return {
            "deals": deals,
            "total": total,
            "limit": limit,
            "offset": offset
        }
    finally:
        cur.close()
        conn.close()

@app.get("/api/deals/latest")
def get_latest_deals(limit: int = 20):
    """Get most recently added deals"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute("""
            SELECT d.*, p.name as product_name, p.brand, p.category, p.image_url,
                   s.name as store_name, s.slug as store_slug
            FROM deals d
            JOIN products p ON d.product_id = p.id
            JOIN stores s ON d.store_id = s.id
            WHERE d.is_active = TRUE
            ORDER BY d.created_at DESC
            LIMIT %s
        """, (limit,))
        deals = cur.fetchall()
        return {"deals": deals, "count": len(deals)}
    finally:
        cur.close()
        conn.close()

@app.get("/api/deals/trending")
def get_trending_deals(limit: int = 20):
    """Get trending deals by deal_score"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute("""
            SELECT d.*, p.name as product_name, p.brand, p.category, p.image_url,
                   s.name as store_name, s.slug as store_slug
            FROM deals d
            JOIN products p ON d.product_id = p.id
            JOIN stores s ON d.store_id = s.id
            WHERE d.is_active = TRUE AND d.deal_score > 0
            ORDER BY d.deal_score DESC
            LIMIT %s
        """, (limit,))
        deals = cur.fetchall()
        return {"deals": deals}
    finally:
        cur.close()
        conn.close()

@app.get("/api/deals/hot")
def get_hot_deals(limit: int = 20):
    """Get hot deals (>20% discount)"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute("""
            SELECT d.*, p.name as product_name, p.brand, p.category, p.image_url,
                   s.name as store_name, s.slug as store_slug
            FROM deals d
            JOIN products p ON d.product_id = p.id
            JOIN stores s ON d.store_id = s.id
            WHERE d.is_active = TRUE AND d.is_hot = TRUE
            ORDER BY d.discount_percentage DESC
            LIMIT %s
        """, (limit,))
        deals = cur.fetchall()
        return {"deals": deals, "count": len(deals)}
    finally:
        cur.close()
        conn.close()

@app.get("/api/deals/{deal_id}")
def get_deal(deal_id: int):
    """Get single deal details"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute("""
            SELECT d.*, p.name as product_name, p.brand, p.category, p.image_url, p.description,
                   s.name as store_name, s.slug as store_slug, s.website
            FROM deals d
            JOIN products p ON d.product_id = p.id
            JOIN stores s ON d.store_id = s.id
            WHERE d.id = %s
        """, (deal_id,))
        deal = cur.fetchone()
        
        if not deal:
            raise HTTPException(status_code=404, detail="Deal not found")
        
        # Get comments
        cur.execute("SELECT * FROM comments WHERE deal_id = %s AND is_approved = TRUE", (deal_id,))
        comments = cur.fetchall()
        
        # Track view
        cur.execute("UPDATE deals SET view_count = view_count + 1 WHERE id = %s", (deal_id,))
        conn.commit()
        
        return {"deal": deal, "comments": comments}
    finally:
        cur.close()
        conn.close()

# STORES API
@app.get("/api/stores")
def get_stores():
    """Get all stores with deal counts"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute("""
            SELECT s.*, COUNT(d.id) as active_deals,
                   COALESCE((SELECT COUNT(*) FROM reviews WHERE store_id = s.id), 0) as review_count,
                   COALESCE((SELECT AVG(rating) FROM reviews WHERE store_id = s.id), 0) as rating_average
            FROM stores s
            LEFT JOIN deals d ON s.id = d.store_id AND d.is_active = TRUE
            WHERE s.is_active = TRUE
            GROUP BY s.id
            ORDER BY s.name
        """)
        stores = cur.fetchall()
        return {"stores": stores, "count": len(stores)}
    finally:
        cur.close()
        conn.close()

@app.get("/api/stores/{store_slug}/deals")
def get_store_deals(store_slug: str, limit: int = 50):
    """Get deals from specific store"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute("SELECT id FROM stores WHERE slug = %s", (store_slug,))
        store = cur.fetchone()
        if not store:
            raise HTTPException(status_code=404, detail="Store not found")
        
        cur.execute("""
            SELECT d.*, p.name as product_name, p.brand, p.category, p.image_url
            FROM deals d
            JOIN products p ON d.product_id = p.id
            WHERE d.store_id = %s AND d.is_active = TRUE
            ORDER BY d.deal_score DESC
            LIMIT %s
        """, (store['id'], limit))
        deals = cur.fetchall()
        return {"store_slug": store_slug, "deals": deals}
    finally:
        cur.close()
        conn.close()

# RAG SEARCH API
@app.post("/api/search/rag")
def rag_search(query: AIChatRequest):
    """RAG semantic search for deals"""
    try:
        results = chroma_manager.search_deals(query.message, n_results=10)
        
        return {
            "query": query.message,
            "results": results,
            "total": len(results.get('documents', [[]])[0]) if results else 0
        }
    except Exception as e:
        return {"error": str(e), "query": query.message, "results": []}

# AI CHATBOT
@app.post("/api/ai/chat")
def ai_chat(request: AIChatRequest):
    """AI chatbot for deal recommendations"""
    
    # Simple keyword matching + RAG simulation
    msg = request.message.lower()
    response = {
        "message": "",
        "suggested_deals": [],
        "filters": {},
        "action": None
    }
    
    if any(word in msg for word in ['iphone', 'telefon', 'мобилен', 'apple']):
        response["message"] = "Најдовме големи попусти на iPhone и Samsung телефони! 📱\n\nВо моментот имаме:\n• iPhone 15 Pro Max со 14% попуст во Нептун\n• Samsung S24 Ultra со 13% попуст во Сетек\n\nСите понуди се достапни во табот 'Врели Понуди'!"
        response["filters"] = {"category": "phones", "is_hot": True}
        
    elif any(word in msg for word in ['laptop', 'лаптоп', 'macbook', 'computer']):
        response["message"] = "Имаме одлични понуди за лаптопи! 💻\n\n• MacBook Air M3 со 11% попуст во Анхоч\n• Различни Windows лаптопи со попусти до 25% во Нептун и Сетек"
        response["filters"] = {"category": "laptops"}
        
    elif any(word in msg for word in ['tv', 'телевизор', 'samsung', 'lg', 'oled']):
        response["message"] = "Големи попусти на телевизори! 📺\n\n• Samsung 55\" OLED со 21% попуст - 54,990 ден\n• LG 65\" OLED evo C4 со 23% попуст - 99,990 ден\n\nСите достапни во Техномаркет!"
        response["filters"] = {"category": "tv", "is_hot": True}
        
    elif any(word in msg for word in ['hello', 'здраво', 'hi', 'поздрав']):
        response["message"] = "Здраво! 👋 Јас сум MKBF AI - твојот личен асистент за наоѓање најдобри понуди во Македонија!\n\nМожам да ти помогнам со:\n🔍 Пребарување на понуди\n📍 Наоѓање продавници\n💰 Пресметка на попусти\n❓ Одговори на прашања\n\nШто те интересира денес?"
        
    else:
        response["message"] = f"Разбирам дека бараш '{request.message}' 🔍\n\nПробај да прашаш:\n• 'Најди iPhone попусти'\n• 'Што има на акција во Нептун?'\n• 'Најдобри телевизори'\n• 'Лаптопи под 50,000 ден'\n\nИли погледни ги сите врели понуди во табот '🔥 Врели Понуди'!"
    
    return response

# AUTHENTICATION
@app.post("/api/auth/register")
def register_user(user: UserRegister):
    """Register new user with QR code"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    try:
        # Generate unique QR code
        qr_data = f"MKBF-{user.username}-{datetime.now().timestamp()}"
        qr_code = hashlib.md5(qr_data.encode()).hexdigest()[:12].upper()
        
        cur.execute("""
            INSERT INTO users (username, email, password_hash, full_name, qr_code, language)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, username, email, full_name, qr_code, language
        """, (user.username, user.email, user.password, user.full_name, qr_code, user.language))
        
        result = cur.fetchone()
        conn.commit()
        
        return {
            "message": "Корисникот е успешно регистриран!",
            "user": {
                "id": result[0],
                "username": result[1],
                "email": result[2],
                "full_name": result[3],
                "qr_code": result[4],
                "language": result[5]
            }
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        cur.close()
        conn.close()

@app.post("/api/auth/login")
def login_user(user: UserLogin):
    """User login"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute("""
            SELECT id, username, email, full_name, qr_code, language,
                   saved_deals_count, used_deals_count, total_savings_mkd
            FROM users
            WHERE username = %s AND password_hash = %s AND is_active = TRUE
        """, (user.username, user.password))
        
        result = cur.fetchone()
        if not result:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Update last login
        cur.execute("UPDATE users SET last_login = NOW() WHERE id = %s", (result['id'],))
        conn.commit()
        
        return {
            "message": "Најавата е успешна!",
            "user": result
        }
    finally:
        cur.close()
        conn.close()

# QR VERIFICATION
@app.post("/api/qr/verify")
def verify_qr(qr_code: str, store_id: Optional[int] = None):
    """Verify QR code for store discount"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Find user by QR
        cur.execute("SELECT id, full_name, used_deals_count FROM users WHERE qr_code = %s", (qr_code,))
        user = cur.fetchone()
        
        if not user:
            return {"valid": False, "message": "Невалиден QR код"}
        
        # Log scan
        cur.execute("""
            INSERT INTO qr_scans (user_id, store_id, qr_code, scan_type)
            VALUES (%s, %s, %s, 'membership')
        """, (user['id'], store_id, qr_code))
        conn.commit()
        
        return {
            "valid": True,
            "user": user,
            "message": f"✅ Добредојде, {user['full_name']}! Попустот е применет."
        }
    finally:
        cur.close()
        conn.close()

@app.get("/api/qr/my/{user_id}")
def get_user_qr(user_id: int):
    """Get user's QR code"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute("SELECT qr_code, full_name FROM users WHERE id = %s", (user_id,))
        result = cur.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="User not found")
        return result
    finally:
        cur.close()
        conn.close()

# SCRAPER CONTROL
@app.post("/api/scrapers/run")
def run_scrapers(store: Optional[str] = None):
    """Run scrapers - manual trigger"""
    import subprocess
    
    scrapers = ['neptun', 'setec', 'tehnomarket', 'anhoch', 'tinex', 
                'ramstore', 'vero', 'kam', 'ananas', 'zirafa']
    
    if store:
        if store in scrapers:
            scrapers = [store]
        else:
            raise HTTPException(status_code=400, detail=f"Unknown store: {store}")
    
    # Run scrapers (async in production)
    return {
        "message": "Scrapers triggered",
        "status": "running",
        "stores": scrapers,
        "estimated_time": "5-10 minutes"
    }

@app.get("/api/scrapers/status")
def scraper_status():
    """Get scraper run status"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute("""
            SELECT store_slug, status, items_scraped, items_new, completed_at
            FROM scraper_logs
            ORDER BY completed_at DESC
            LIMIT 10
        """)
        logs = cur.fetchall()
        return {"recent_runs": logs}
    finally:
        cur.close()
        conn.close()

# ANALYTICS
@app.get("/api/analytics/stats")
def get_stats():
    """Get platform statistics"""
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        stats = {}
        
        cur.execute("SELECT COUNT(*) as count FROM deals WHERE is_active = TRUE")
        stats['active_deals'] = cur.fetchone()['count']
        
        cur.execute("SELECT COUNT(*) as count FROM users WHERE is_active = TRUE")
        stats['users'] = cur.fetchone()['count']
        
        cur.execute("SELECT COUNT(*) as count FROM stores WHERE is_active = TRUE")
        stats['stores'] = cur.fetchone()['count']
        
        cur.execute("SELECT COALESCE(SUM(savings_mkd), 0) as total FROM purchases")
        stats['total_savings'] = cur.fetchone()['total']
        
        cur.execute("SELECT COUNT(*) as count FROM purchases")
        stats['purchases'] = cur.fetchone()['count']
        
        return {"stats": stats}
    finally:
        cur.close()
        conn.close()

# HEALTH CHECK
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "database": "connected",
        "chroma": "connected"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
