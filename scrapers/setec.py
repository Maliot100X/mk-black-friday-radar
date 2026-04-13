"""Setec Scraper - setec.mk"""
from .base import BaseScraper
from bs4 import BeautifulSoup
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class SetecScraper(BaseScraper):
    def __init__(self): super().__init__('setec', 'Setec', 'https://www.setec.mk')
    def scrape(self) -> List[Dict]:
        logger.info("🔥 Scraping Setec...")
        deals = []
        urls = ['https://www.setec.mk/laptopi', 'https://www.setec.mk/mobilni-telefoni', 'https://www.setec.mk/akcija']
        for url in urls:
            html = self.fetch_page(url)
            if not html: continue
            soup = BeautifulSoup(html, 'html.parser')
            products = soup.find_all('div', class_='product-layout')
            for p in products:
                try:
                    name = p.find('h4')
                    if not name: continue
                    name = name.text.strip()
                    price_new = p.find('span', class_='price-new')
                    price_old = p.find('span', class_='price-old')
                    if price_new:
                        discount_price = self.parse_price(price_new.text)
                        original_price = self.parse_price(price_old.text) if price_old else discount_price
                    else: continue
                    discount = self.calculate_discount(original_price, discount_price)
                    if self.is_valid_deal(discount):
                        deals.append({'product_name': name, 'category': self.detect_category(name),
                            'original_price_mkd': original_price, 'discount_price_mkd': discount_price,
                            'discount_percentage': discount, 'deal_url': url, 'is_hot': discount > 20})
                except: continue
        logger.info(f"✅ Setec: {len(deals)} deals")
        return deals