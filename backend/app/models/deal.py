from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Deal(Base):
    __tablename__ = "deals"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    
    # North Macedonia Currency - MKD (денар)
    original_price_mkd = Column(Float, nullable=False)
    discount_price_mkd = Column(Float, nullable=False)
    discount_percentage = Column(Integer, nullable=False)
    
    # Product details
    category = Column(String(100), nullable=False, index=True)
    brand = Column(String(100), nullable=True)
    image_url = Column(String(1000), nullable=True)
    product_url = Column(String(1000), nullable=True)
    
    # Store relationship
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    store_name = Column(String(200), nullable=False)
    
    # Location (for map)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    city = Column(String(100), default="Скопје")
    
    # Deal status
    is_active = Column(Boolean, default=True)
    is_hot = Column(Boolean, default=False)
    is_featured = Column(Boolean, default=False)
    
    # Timestamps
    starts_at = Column(DateTime(timezone=True), nullable=False)
    ends_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Analytics
    view_count = Column(Integer, default=0)
    click_count = Column(Integer, default=0)
    purchase_count = Column(Integer, default=0)
    
    # Source
    source = Column(String(100), nullable=True)
    
    # AI ranking score
    ai_score = Column(Float, default=0.0)
    
    # Extra metadata
    metadata = Column(JSON, default={})

class Store(Base):
    __tablename__ = "stores"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, nullable=False)
    
    # North Macedonia stores
    category = Column(String(100), nullable=False)
    
    # Contact
    address = Column(String(500), nullable=True)
    city = Column(String(100), default="Скопје")
    phone = Column(String(50), nullable=True)
    website = Column(String(500), nullable=True)
    
    # Location
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Logo
    logo_url = Column(String(1000), nullable=True)
    
    # Store type
    is_partner = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    
    # Analytics
    deal_count = Column(Integer, default=0)
    qr_scan_count = Column(Integer, default=0)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
