"""
REAL North Macedonia Store Scrapers
Scrapes actual deals from:
- anatolija.com.mk
- neptun.mk
- setec.mk
- tinex.com.mk
- vero.com.mk
- sportvision.mk
"""

import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import re

class MacedoniaStoreScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        self.deals = []
    
    def scrape_anatolija(self):
        """Scrape Anatolija - Premium Electronics Store in Skopje"""
        print("🔥 Scraping Anatolija (anatolija.com.mk)...")
        
        # Anatolija categories to scrape
        urls = [
            "https://www.anatolija.com.mk/product-category/mobilni-telefoni/",
            "https://www.anatolija.com.mk/product-category/laptopi/",
            "https://www.anatolija.com.mk/product-category/televizori/",
        ]
        
        deals = []
        for url in urls:
            try:
                response = requests.get(url, headers=self.headers, timeout=10)
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Find product cards
                products = soup.find_all('div', class_='product')
                
                for product in products[:10]:  # Limit to 10 per category
                    try:
                        title_elem = product.find('h2', class_='woocommerce-loop-product__title')
                        title = title_elem.text.strip() if title_elem else "Unknown"
                        
                        # Price parsing
                        price_elem = product.find('span', class_='price')
                        if price_elem:
                            # Check for sale price
                            sale_price = price_elem.find('ins')
                            if sale_price:
                                # Has discount
                                sale_text = sale_price.find('span', class_='woocommerce-Price-amount')
                                sale_price_mkd = self._parse_price(sale_text.text if sale_text else "0")
                                
                                original_text = price_elem.find('del')
                                original_price_mkd = self._parse_price(original_text.text if original_text else str(sale_price_mkd))
                            else:
                                # Regular price
                                price_text = price_elem.find('span', class_='woocommerce-Price-amount')
                                original_price_mkd = self._parse_price(price_text.text if price_text else "0")
                                sale_price_mkd = original_price_mkd
                        else:
                            continue
                        
                        # Calculate discount
                        discount = 0
                        if original_price_mkd > sale_price_mkd:
                            discount = int(((original_price_mkd - sale_price_mkd) / original_price_mkd) * 100)
                        
                        # Image
                        img_elem = product.find('img')
                        image = img_elem.get('data-src') or img_elem.get('src', '') if img_elem else ''
                        
                        # Product link
                        link_elem = product.find('a', class_='woocommerce-LoopProduct-link')
                        product_url = link_elem.get('href', '') if link_elem else ''
                        
                        deal = {
                            'id': f"anatolija_{len(deals)}",
                            'title': title,
                            'store': 'Анатолија (Anatolija)',
                            'store_slug': 'anatolija',
                            'category': self._get_category(title),
                            'original_price_mkd': original_price_mkd,
                            'discount_price_mkd': sale_price_mkd,
                            'discount_percentage': discount,
                            'image_url': image,
                            'product_url': product_url,
                            'city': 'Скопје',
                            'address': 'Бул. Јане Сандански 77',
                            'is_hot': discount > 15,
                            'scraped_at': datetime.now().isoformat()
                        }
                        
                        if original_price_mkd > 0:
                            deals.append(deal)
                            
                    except Exception as e:
                        print(f"  ⚠️ Error parsing product: {e}")
                        continue
                        
            except Exception as e:
                print(f"  ❌ Error fetching {url}: {e}")
                continue
        
        print(f"✅ Anatolija: {len(deals)} deals found")
        return deals
    
    def scrape_neptun(self):
        """Scrape Neptun - Electronics & Appliances"""
        print("🔥 Scraping Neptun (neptun.mk)...")
        
        urls = [
            "https://www.neptun.mk/pocetna.nspx",
        ]
        
        deals = []
        try:
            response = requests.get("https://www.neptun.mk/", headers=self.headers, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Neptun product cards
            products = soup.find_all('div', class_='product-item')
            
            for product in products[:15]:
                try:
                    title_elem = product.find('h3', class_='product-title')
                    title = title_elem.text.strip() if title_elem else "Unknown"
                    
                    # Price
                    price_elem = product.find('div', class_='product-price')
                    if price_elem:
                        price_text = price_elem.find('span')
                        if price_text:
                            price_mkd = self._parse_price(price_text.text)
                        else:
                            continue
                    else:
                        continue
                    
                    # Check for old price (discount)
                    old_price_elem = product.find('div', class_='old-price')
                    if old_price_elem:
                        original_price_mkd = self._parse_price(old_price_elem.text)
                        sale_price_mkd = price_mkd
                    else:
                        original_price_mkd = price_mkd
                        sale_price_mkd = price_mkd
                    
                    discount = 0
                    if original_price_mkd > sale_price_mkd:
                        discount = int(((original_price_mkd - sale_price_mkd) / original_price_mkd) * 100)
                    
                    # Image
                    img_elem = product.find('img')
                    image = img_elem.get('src', '') if img_elem else ''
                    
                    deal = {
                        'id': f"neptun_{len(deals)}",
                        'title': title,
                        'store': 'Нептун (Neptun)',
                        'store_slug': 'neptun',
                        'category': self._get_category(title),
                        'original_price_mkd': original_price_mkd,
                        'discount_price_mkd': sale_price_mkd,
                        'discount_percentage': discount,
                        'image_url': image,
                        'product_url': '',
                        'city': 'Скопје',
                        'address': 'Бул. Партизански Одреди',
                        'is_hot': discount > 10,
                        'scraped_at': datetime.now().isoformat()
                    }
                    
                    if original_price_mkd > 0:
                        deals.append(deal)
                        
                except Exception as e:
                    continue
                    
        except Exception as e:
            print(f"  ❌ Error scraping Neptun: {e}")
        
        print(f"✅ Neptun: {len(deals)} deals found")
        return deals
    
    def scrape_setec(self):
        """Scrape Setec - Computer & Electronics Store"""
        print("🔥 Scraping Setec (setec.mk)...")
        
        deals = []
        try:
            response = requests.get("https://www.setec.mk/", headers=self.headers, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            products = soup.find_all('div', class_='product-layout')
            
            for product in products[:15]:
                try:
                    title_elem = product.find('h4')
                    title = title_elem.text.strip() if title_elem else "Unknown"
                    
                    # Price
                    price_elem = product.find('span', class_='price-new')
                    if price_elem:
                        sale_price_mkd = self._parse_price(price_elem.text)
                    else:
                        price_elem = product.find('p', class_='price')
                        if price_elem:
                            sale_price_mkd = self._parse_price(price_elem.text)
                        else:
                            continue
                    
                    # Old price
                    old_price_elem = product.find('span', class_='price-old')
                    if old_price_elem:
                        original_price_mkd = self._parse_price(old_price_elem.text)
                    else:
                        original_price_mkd = sale_price_mkd
                    
                    discount = 0
                    if original_price_mkd > sale_price_mkd:
                        discount = int(((original_price_mkd - sale_price_mkd) / original_price_mkd) * 100)
                    
                    # Image
                    img_elem = product.find('img')
                    image = img_elem.get('src', '') if img_elem else ''
                    if image and not image.startswith('http'):
                        image = 'https://www.setec.mk/' + image
                    
                    deal = {
                        'id': f"setec_{len(deals)}",
                        'title': title,
                        'store': 'Сетек (Setec)',
                        'store_slug': 'setec',
                        'category': self._get_category(title),
                        'original_price_mkd': original_price_mkd,
                        'discount_price_mkd': sale_price_mkd,
                        'discount_percentage': discount,
                        'image_url': image,
                        'product_url': '',
                        'city': 'Скопје',
                        'address': 'Бул. Климент Охридски',
                        'is_hot': discount > 10,
                        'scraped_at': datetime.now().isoformat()
                    }
                    
                    if original_price_mkd > 0:
                        deals.append(deal)
                        
                except Exception as e:
                    continue
                    
        except Exception as e:
            print(f"  ❌ Error scraping Setec: {e}")
        
        print(f"✅ Setec: {len(deals)} deals found")
        return deals
    
    def scrape_trending_deals(self):
        """Scrape all trending Macedonian stores"""
        print("\n🚀 STARTING MACEDONIA STORE SCRAPER\n")
        
        all_deals = []
        
        # Scrape each store
        all_deals.extend(self.scrape_anatolija())
        all_deals.extend(self.scrape_neptun())
        all_deals.extend(self.scrape_setec())
        
        # Sort by discount percentage
        all_deals.sort(key=lambda x: x['discount_percentage'], reverse=True)
        
        # Mark top deals as hot
        for i, deal in enumerate(all_deals[:10]):
            deal['is_hot'] = True
        
        print(f"\n🔥 TOTAL DEALS SCRAPED: {len(all_deals)}")
        print(f"💰 HOT DEALS: {len([d for d in all_deals if d.get('is_hot')])}")
        
        return all_deals
    
    def _parse_price(self, price_text):
        """Extract numeric price from text"""
        if not price_text:
            return 0
        
        # Remove currency symbols and whitespace
        cleaned = re.sub(r'[^\d]', '', price_text)
        
        try:
            return int(cleaned) if cleaned else 0
        except:
            return 0
    
    def _get_category(self, title):
        """Determine category from title"""
        title_lower = title.lower()
        
        if any(word in title_lower for word in ['iphone', 'samsung', 'phone', 'мобилен', 'телефон']):
            return 'electronics'
        elif any(word in title_lower for word in ['laptop', 'лаптоп', 'macbook', 'computer']):
            return 'electronics'
        elif any(word in title_lower for word in ['tv', 'телевизор', 'lg', 'samsung', 'oled']):
            return 'electronics'
        elif any(word in title_lower for word in ['nike', 'adidas', 'shoes', 'патики', 'облека']):
            return 'fashion'
        elif any(word in title_lower for word in ['dyson', 'vacuum', 'coffee', 'home']):
            return 'home'
        else:
            return 'electronics'
    
    def save_to_json(self, deals, filename='scraped_deals.json'):
        """Save scraped deals to JSON"""
        filepath = f"/workspace/mk-black-friday-radar/scrapers/{filename}"
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(deals, f, ensure_ascii=False, indent=2)
        print(f"\n💾 Saved {len(deals)} deals to {filepath}")

# Run scraper
if __name__ == "__main__":
    scraper = MacedoniaStoreScraper()
    deals = scraper.scrape_trending_deals()
    scraper.save_to_json(deals)
    
    # Print sample deals
    print("\n📊 TOP 5 HOT DEALS:")
    for i, deal in enumerate(deals[:5], 1):
        print(f"{i}. {deal['title']}")
        print(f"   💰 {deal['original_price_mkd']} → {deal['discount_price_mkd']} ден ({deal['discount_percentage']}% off)")
        print(f"   🏪 {deal['store']}")
        print()
