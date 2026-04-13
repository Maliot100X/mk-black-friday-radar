"""Zirafa Scraper - zirafa.mk"""
from .base import BaseScraper
from bs4 import BeautifulSoup
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class ZirafaScraper(BaseScraper):
    def __init__(self): super().__init__('zirafa', 'Zirafa', 'https://www.zirafa.mk')
    def scrape(self) -> List[Dict]:
        logger.info("🔥 Scraping Zirafa...")
        deals = []
        urls = ['https://www.zirafa.mk/promo', 'https://www.zirafa.mk/deals']
        for url in urls:
            html = self.fetch_page(url)
            if not html: continue
            soup = BeautifulSoup(html, 'html.parser')
            products = soup.find_all('div', class_='product')
            for p in products:
                try:
                    name = p.find('h3')
                    if not name: continue
                    name = name.text.strip()
                    price = p.find('span', class_='price')
                    old_price = p.find('span', class_='old-price')
                    if price:
                        discount_price = self.parse_price(price.text)
                        original_price = self.parse_price(old_price.text) if old_price else discount_price
                    else: continue
                    discount = self.calculate_discount(original_price, discount_price)
                    if self.is_valid_deal(discount):
                        deals.append({'product_name': name, 'category': 'marketplace',
                            'original_price_mkd': original_price, 'discount_price_mkd': discount_price,
                            'discount_percentage': discount, 'deal_url': url, 'is_hot': discount > 20})
                except: continue
        logger.info(f"✅ Zirafa: {len(deals)} deals")
        return deals