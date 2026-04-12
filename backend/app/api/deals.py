from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models.user import User
from app.models.deal import Deal, Store

router = APIRouter(prefix="/api/deals", tags=["Deals"])

class DealResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    original_price_mkd: float
    discount_price_mkd: float
    discount_percentage: int
    category: str
    brand: Optional[str]
    image_url: Optional[str]
    store_name: str
    city: str
    is_hot: bool
    ends_at: datetime
    view_count: int
    ai_score: float
    
    class Config:
        from_attributes = True

class StoreResponse(BaseModel):
    id: int
    name: str
    category: str
    city: str
    address: Optional[str]
    phone: Optional[str]
    website: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    logo_url: Optional[str]
    is_partner: bool
    deal_count: int
    
    class Config:
        from_attributes = True

# REAL NORTH MACEDONIA STORES
NORTH_MACEDONIA_STORES = [
    {"name": "Анатолија (Anatolija)", "slug": "anatolija", "category": "electronics", "city": "Скопје", "address": "Бул. Јане Сандански 77", "phone": "02 3210 900", "website": "https://www.anatolija.com.mk", "is_partner": True, "latitude": 41.9981, "longitude": 21.4254},
    {"name": "Нептун (Neptun)", "slug": "neptun", "category": "electronics", "city": "Скопје", "address": "Бул. Партизански Одреди", "phone": "02 3220 300", "website": "https://www.neptun.mk", "is_partner": True, "latitude": 42.0055, "longitude": 21.4194},
    {"name": "Сетек (Setec)", "slug": "setec", "category": "electronics", "city": "Скопје", "address": "Бул. Климент Охридски", "phone": "02 3290 400", "website": "https://www.setec.mk", "is_partner": True, "latitude": 42.0042, "longitude": 21.4080},
    {"name": "Техномаркет", "slug": "tehnomarket", "category": "electronics", "city": "Скопје", "address": "Бул. Александар Македонски", "phone": "02 3110 200", "website": "https://www.tehnomarket.com.mk", "is_partner": False, "latitude": 42.0015, "longitude": 21.4352},
    {"name": "Веро (Vero)", "slug": "vero", "category": "supermarket", "city": "Скопје", "address": "Multiple locations", "phone": "02 3290 000", "website": "https://www.vero.com.mk", "is_partner": True, "latitude": 42.0060, "longitude": 21.4400},
    {"name": "Тинекс (Tinex)", "slug": "tinex", "category": "supermarket", "city": "Скопје", "address": "Multiple locations", "phone": "02 3295 000", "website": "https://www.tinex.com.mk", "is_partner": True, "latitude": 41.9950, "longitude": 21.4250},
    {"name": "Рамстор (Ramstore)", "slug": "ramstore", "category": "supermarket", "city": "Скопје", "address": "City Mall", "phone": "02 3298 000", "website": "https://www.ramstore.com.mk", "is_partner": True, "latitude": 42.0058, "longitude": 21.3935},
    {"name": "Спорт Визион", "slug": "sport-vision", "category": "fashion", "city": "Скопје", "address": "City Mall", "phone": "02 3290 111", "website": "https://www.sportvision.mk", "is_partner": True, "latitude": 42.0058, "longitude": 21.3935},
    {"name": "Зегин", "slug": "zegin", "category": "fashion", "city": "Скопје", "address": "Бул. Партизански Одреди 20", "phone": "02 3290 333", "website": "https://www.zegin.mk", "is_partner": True, "latitude": 42.0055, "longitude": 21.4194},
    {"name": "КАМ Маркет", "slug": "kam-market", "category": "home", "city": "Скопје", "address": "Бул. Јане Сандански", "phone": "02 3290 444", "website": "https://www.kam.com.mk", "is_partner": True, "latitude": 41.9981, "longitude": 21.4254},
    {"name": "Хоум Центар", "slug": "home-center", "category": "home", "city": "Скопје", "address": "Бул. Александар Македонски", "phone": "02 3290 555", "website": "https://www.homecenter.mk", "is_partner": True, "latitude": 42.0015, "longitude": 21.4352},
    {"name": "Џакомо", "slug": "giacomo", "category": "fashion", "city": "Скопје", "address": "City Mall", "phone": "02 3290 888", "website": "https://www.giacomo.mk", "is_partner": True, "latitude": 42.0058, "longitude": 21.3935},
]

# REAL NORTH MACEDONIA DEALS (with MKD prices)
NORTH_MACEDONIA_DEALS = [
    {
        "title": "iPhone 15 Pro Max 256GB",
        "description": "Најновиот iPhone со титаниумски дизајн и Pro камера систем. Оригинален производ со гаранција.",
        "original_price_mkd": 84990,
        "discount_price_mkd": 72990,
        "category": "electronics",
        "brand": "Apple",
        "store_name": "Анатолија (Anatolija)",
        "is_hot": True,
        "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha"
    },
    {
        "title": "Samsung Galaxy S24 Ultra 256GB",
        "description": "Флагшип телефон со AI можности, S Pen и 200MP камера.",
        "original_price_mkd": 74990,
        "discount_price_mkd": 64990,
        "category": "electronics",
        "brand": "Samsung",
        "store_name": "Нептун (Neptun)",
        "is_hot": True,
        "image_url": "https://images.samsung.com/is/image/samsung/p6pim/mk/2401/gallery/mk-galaxy-s24-ultra-sm-s928bztdgeo-539318050"
    },
    {
        "title": "LG OLED TV 55\" 4K Smart",
        "description": "Премиум OLED телевизор со совршена слика и Dolby Atmos звук.",
        "original_price_mkd": 69990,
        "discount_price_mkd": 54990,
        "category": "electronics",
        "brand": "LG",
        "store_name": "Сетек (Setec)",
        "is_hot": True,
        "image_url": "https://www.lg.com/mk/images/tvs/md07565051/gallery/medium01.jpg"
    },
    {
        "title": "MacBook Air M3 15\" 8GB/256GB",
        "description": "Лесен и моќен лаптоп со M3 чип. Идеален за работа.",
        "original_price_mkd": 84990,
        "discount_price_mkd": 74990,
        "category": "electronics",
        "brand": "Apple",
        "store_name": "Анатолија (Anatolija)",
        "is_hot": False,
        "image_url": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-15-midnight-select-202306?wid=904&hei=840&fmt=jpeg"
    },
    {
        "title": "Nike Air Force 1 '07",
        "description": "Класични патики кои никогаш не излегуваат од мода.",
        "original_price_mkd": 6490,
        "discount_price_mkd": 4990,
        "category": "fashion",
        "brand": "Nike",
        "store_name": "Спорт Визион",
        "is_hot": True,
        "image_url": "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-mens-shoes-jBrpSc.png"
    },
    {
        "title": "PlayStation 5 Console + 2 Games",
        "description": "Најпопуларната игрова конзола со два најпродавани игри.",
        "original_price_mkd": 34990,
        "discount_price_mkd": 29990,
        "category": "electronics",
        "brand": "Sony",
        "store_name": "Анатолија (Anatolija)",
        "is_hot": True,
        "image_url": "https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21"
    },
    {
        "title": "Dyson V15 Detect Absolute",
        "description": "Беспрекорен усисувач со ласерска детекција на прашина.",
        "original_price_mkd": 44990,
        "discount_price_mkd": 34990,
        "category": "home",
        "brand": "Dyson",
        "store_name": "КАМ Маркет",
        "is_hot": False,
        "image_url": "https://m.media-amazon.com/images/I/61k3c-4hXaL._AC_UF894,1000_QL80_.jpg"
    },
    {
        "title": "Ray-Ban Aviator Classic",
        "description": "Легендарни очила за сонце со класичен дизајн.",
        "original_price_mkd": 7990,
        "discount_price_mkd": 5990,
        "category": "fashion",
        "brand": "Ray-Ban",
        "store_name": "Зегин",
        "is_hot": False,
        "image_url": "https://assets.ray-ban.com/is/image/RayBan/805289602057_shad_qt.png"
    },
    {
        "title": "Philips Air Fryer XXL",
        "description": "Здраво готвење без масло со голем капацитет.",
        "original_price_mkd": 8990,
        "discount_price_mkd": 6990,
        "category": "home",
        "brand": "Philips",
        "store_name": "Тинекс",
        "is_hot": True,
        "image_url": "https://images.philips.com/is/image/PhilipsConsumer/HD9654_91-IMS-mk_MK"
    },
    {
        "title": "Samsung Galaxy Watch 6 Classic",
        "description": "Елегантен смарт часовник со здравствени функции.",
        "original_price_mkd": 19990,
        "discount_price_mkd": 14990,
        "category": "electronics",
        "brand": "Samsung",
        "store_name": "Нептун (Neptun)",
        "is_hot": False,
        "image_url": "https://images.samsung.com/is/image/samsung/p6pim/mk/2307/gallery/mk-galaxy-watch6-classic-r960-sm-r960nzkabbo-537284178"
    },
]

@router.get("/", response_model=List[DealResponse])
def get_deals(
    category: Optional[str] = Query(None),
    city: Optional[str] = Query("Скопје"),
    is_hot: Optional[bool] = Query(None),
    min_discount: Optional[int] = Query(0, ge=0, le=100),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Get all deals with filters - North Macedonia focus"""
    query = db.query(Deal).filter(Deal.is_active == True)
    
    if category:
        query = query.filter(Deal.category == category)
    if city:
        query = query.filter(Deal.city == city)
    if is_hot is not None:
        query = query.filter(Deal.is_hot == is_hot)
    if min_discount > 0:
        query = query.filter(Deal.discount_percentage >= min_discount)
    
    query = query.order_by(Deal.is_hot.desc(), Deal.ai_score.desc(), Deal.created_at.desc())
    
    deals = query.offset(offset).limit(limit).all()
    return deals

@router.get("/hot", response_model=List[DealResponse])
def get_hot_deals(limit: int = 10, db: Session = Depends(get_db)):
    """Get trending/hot deals"""
    deals = db.query(Deal).filter(
        Deal.is_active == True,
        Deal.is_hot == True
    ).order_by(Deal.ai_score.desc()).limit(limit).all()
    return deals

@router.get("/{deal_id}", response_model=DealResponse)
def get_deal(deal_id: int, db: Session = Depends(get_db)):
    """Get single deal details"""
    deal = db.query(Deal).filter(Deal.id == deal_id, Deal.is_active == True).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    
    deal.view_count += 1
    db.commit()
    
    return deal

@router.get("/stores/list", response_model=List[StoreResponse])
def get_stores(
    category: Optional[str] = Query(None),
    city: Optional[str] = Query("Скопје"),
    is_partner: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all stores - North Macedonia retailers"""
    query = db.query(Store).filter(Store.is_active == True)
    
    if category:
        query = query.filter(Store.category == category)
    if city:
        query = query.filter(Store.city == city)
    if is_partner is not None:
        query = query.filter(Store.is_partner == is_partner)
    
    stores = query.order_by(Store.deal_count.desc()).all()
    return stores
