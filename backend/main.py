from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine, Base
from app.api import auth, deals

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MK Black Friday Radar API",
    description="AI-powered deal discovery platform for North Macedonia 🇲🇰",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(deals.router)

@app.get("/")
def root():
    return {
        "message": "🔥 MK Black Friday Radar API",
        "version": "1.0.0",
        "region": "North Macedonia 🇲🇰",
        "currency": "MKD (денар)",
        "docs": "/docs",
        "features": [
            "AI Agents",
            "Real MKD Prices",
            "QR Membership",
            "Map Radar",
            "Authentication"
        ]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "mkbf-api"}
