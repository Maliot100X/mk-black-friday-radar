"""Neptun Scraper - neptun.mk"""
from .base import BaseScraper
from bs4 import BeautifulSoup
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class NeptunScraper(BaseScraper):
    def __init__(self):
        super().__init__('neptun', 'Neptun', 'https://www.neptun.mk')
    
    def scrape(self) -> List[Dict]:
        logger.info("🔥 Scraping Neptun...")
        deals = []
        urls = [
            'https://www.neptun.mk/promotions',
            'https://www.neptun.mk/mobile-phones',
            'https://www.neptun.mk/laptopi-tableti',
            'https://www.neptun.mk/tv-audio'
        ]
        for url in urls:
            html = self.fetch_page(url)
            if not html: continue
            soup = BeautifulSoup(html, 'html.parser')
            products = soup.find_all('div', class_=['product-item', 'product-list-item'])
            for product in products:
                try:
                    name_elem = product.find(['h3', 'h2', 'h4', 'a'])
                    if not name_elem: continue
                    product_name = name_elem.get_text(strip=True)
                    if len(product_name) < 3: continue
                    old_price_elem = product.find(['span', 'div'], class_=lambda x: x and 'old' in str(x).lower())
                    current_price_elem = product.find(['span', 'div'], class_=lambda x: x and 'current' in str(x).lower())
                    if current_price_elem:
                        discount_price = self.parse_price(current_price_elem.get_text())
                        original_price = self.parse_price(old_price_elem.get_text()) if old_price_elem else discount_price
                    else: continue
                    discount = self.calculate_discount(original_price, discount_price)
                    if self.is_valid_deal(discount):
                        deals.append({'product_name': product_name, 'category': self.detect_category(product_name),
                            'original_price_mkd': original_price, 'discount_price_mkd': discount_price,
                            'discount_percentage': discount, 'deal_url': url, 'is_hot': discount > 20})
                except: continue
        logger.info(f"✅ Neptun: {len(deals)} deals")
        return deals