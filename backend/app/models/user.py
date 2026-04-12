from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    
    # User type
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_store_owner = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    
    # Profile
    avatar_url = Column(String(500), nullable=True)
    city = Column(String(100), default="Скопје")
    preferred_categories = Column(String(500), default="")
    language = Column(String(10), default="mk")  # mk or al
    
    # QR Code for membership
    qr_code = Column(String(500), unique=True, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)
