"""
PHASE 9: SCRAPER BASE CLASS
Base Scraper for all Macedonian stores
"""

import requests
from bs4 import BeautifulSoup
import time
import random
import logging
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Dict, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BaseScraper(ABC):
    USER_AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ]
    
    DEAL_KEYWORDS = ['акција', 'popust', 'katalog', 'promo', 'black-friday', 'sale', 'discount', 'weekly-offer']
    
    def __init__(self, store_slug: str, store_name: str, base_url: str):
        self.store_slug = store_slug
        self.store_name = store_name
        self.base_url = base_url
        self.session = requests.Session()
    
    def get_headers(self) -> dict:
        return {
            'User-Agent': random.choice(self.USER_AGENTS),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'mk,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        }
    
    def fetch_page(self, url: str, retries: int = 3) -> Optional[str]:
        """Fetch page with retry logic and rate limiting"""
        for attempt in range(retries):
            try:
                time.sleep(random.uniform(1, 3))
                response = self.session.get(url, headers=self.get_headers(), timeout=15)
                if response.status_code == 200:
                    return response.text
                logger.warning(f"Status {response.status_code} for {url}")
            except Exception as e:
                logger.warning(f"Attempt {attempt+1} failed: {e}")
                time.sleep(2 ** attempt)
        return None
    
    def parse_price(self, text: str) -> float:
        """Extract price from text in MKD"""
        if not text:
            return 0.0
        import re
        cleaned = re.sub(r'[^\d.,]', '', text)
        cleaned = cleaned.replace(',', '.')
        try:
            return float(cleaned) if cleaned else 0.0
        except:
            return 0.0
    
    def calculate_discount(self, original: float, discount: float) -> float:
        """Calculate discount percentage"""
        if original <= 0 or discount >= original:
            return 0.0
        return round(((original - discount) / original) * 100, 2)
    
    def is_valid_deal(self, discount_percent: float) -> bool:
        """Only save deals with >5% discount"""
        return discount_percent > 5.0
    
    def detect_category(self, name: str) -> str:
        """Auto-detect product category from name"""
        name_lower = name.lower()
        
        phones = ['phone', 'телефон', 'iphone', 'samsung', 'xiaomi', 'mobile', 'smartphone', 'android']
        if any(word in name_lower for word in phones):
            return 'phones'
        
        laptops = ['laptop', 'лаптоп', 'macbook', 'notebook', 'computer', 'pc']
        if any(word in name_lower for word in laptops):
            return 'laptops'
        
        tv = ['tv', 'телевизор', 'television', 'oled', 'qled', 'smart tv', '4k']
        if any(word in name_lower for word in tv):
            return 'tv'
        
        appliances = ['fridge', 'фрижидер', 'washing', 'machine', 'microwave', 'oven', 'vacuum', 'appliance']
        if any(word in name_lower for word in appliances):
            return 'appliances'
        
        fashion = ['shoes', 'патики', 'shirt', 'jacket', 'pants', 'dress', 'watch', 'fashion', 'clothing']
        if any(word in name_lower for word in fashion):
            return 'fashion'
        
        return 'electronics'
    
    def save_to_db(self, deals: List[Dict]):
        """Save scraped deals to database"""
        import psycopg2
        from psycopg2.extras import execute_values
        
        conn = psycopg2.connect("postgresql://postgres:postgres@localhost:5432/mkbf_deals")
        cur = conn.cursor()
        
        try:
            for deal in deals:
                # Insert or get product
                cur.execute("""
                    INSERT INTO products (name, category)
                    VALUES (%s, %s)
                    ON CONFLICT DO NOTHING
                    RETURNING id
                """, (deal['product_name'], deal['category']))
                
                product_result = cur.fetchone()
                if product_result:
                    product_id = product_result[0]
                else:
                    cur.execute("SELECT id FROM products WHERE name = %s", (deal['product_name'],))
                    product_id = cur.fetchone()[0]
                
                # Get store_id
                cur.execute("SELECT id FROM stores WHERE slug = %s", (self.store_slug,))
                store_id = cur.fetchone()[0]
                
                # Insert deal
                cur.execute("""
                    INSERT INTO deals (product_id, store_id, original_price_mkd, discount_price_mkd,
                                     discount_percentage, deal_url, is_hot, scraped_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                    ON CONFLICT DO NOTHING
                """, (product_id, store_id, deal['original_price_mkd'], deal['discount_price_mkd'],
                      deal['discount_percentage'], deal.get('deal_url', ''), deal['is_hot']))
            
            conn.commit()
            logger.info(f"✅ Saved {len(deals)} deals to database")
            
        except Exception as e:
            conn.rollback()
            logger.error(f"Error saving to DB: {e}")
        finally:
            cur.close()
            conn.close()
    
    @abstractmethod
    def scrape(self) -> List[Dict]:
        """Main scrape method - must be implemented by each store"""
        pass
    
    def run(self):
        """Run scraper and save results"""
        logger.info(f"🔥 Starting scraper for {self.store_name}")
        deals = self.scrape()
        if deals:
            self.save_to_db(deals)
        logger.info(f"✅ Scraped {len(deals)} deals from {self.store_name}")
        return deals
