"""
PHASE 7: AI AGENT SYSTEM
CrewAI implementation for MK Black Friday Radar
"""

from crewai import Agent, Task, Crew
from crewai.tools import tool
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

# TOOLS

@tool("Scrape Store")
def scrape_store(store_slug: str) -> str:
    """Scrape deals from a Macedonian store"""
    urls = {
        'neptun': 'https://www.neptun.mk/promotions',
        'setec': 'https://www.setec.mk/laptopi',
        'tehnomarket': 'https://www.tehnomarket.com.mk/akcija',
        'anhoch': 'https://www.anhoch.com/promotions',
        'tinex': 'https://www.tinex.mk/weekly-offers',
        'ramstore': 'https://ramstore.com.mk/promotions',
        'vero': 'https://vero.com.mk/akcija',
        'kam': 'https://kam.com.mk/promotions',
        'ananas': 'https://www.ananas.mk/deals',
        'zirafa': 'https://www.zirafa.mk/promo'
    }
    
    url = urls.get(store_slug, '')
    if not url:
        return f"No URL for {store_slug}"
    
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (compatible; MKBF-Bot/1.0)'}
        response = requests.get(url, headers=headers, timeout=15)
        return response.text[:8000]
    except Exception as e:
        return f"Error: {str(e)}"

@tool("Extract Products")
def extract_products(html: str) -> str:
    """Extract product data from HTML"""
    soup = BeautifulSoup(html, 'html.parser')
    products = []
    
    for item in soup.find_all(['div', 'article', 'li'], class_=lambda x: x and 'product' in str(x).lower()):
        name = item.find(['h2', 'h3', 'h4', 'a', 'span'], class_=lambda x: x and any(w in str(x).lower() for w in ['title', 'name', 'product']))
        price = item.find(['span', 'div', 'p'], class_=lambda x: x and 'price' in str(x).lower())
        old_price = item.find(['span', 'div', 'p'], class_=lambda x: x and 'old' in str(x).lower())
        
        if name:
            products.append({
                'name': name.get_text(strip=True),
                'price': price.get_text(strip=True) if price else None,
                'old_price': old_price.get_text(strip=True) if old_price else None
            })
    
    return json.dumps(products[:15], ensure_ascii=False)

@tool("Calculate Deal Score")
def calculate_score(discount: float, rating: float, clicks: int) -> str:
    """Calculate deal score using weighted algorithm"""
    score = (discount * 0.6) + (rating * 0.2) + (min(clicks / 100, 20) * 0.2)
    return f"{score:.2f}"

# AGENTS

scraper_agent = Agent(
    role="Web Scraper",
    goal="Collect deals from Macedonian stores every 30 minutes",
    backstory="Expert web scraper specializing in Macedonian e-commerce sites like Neptun, Setec, Tinex",
    tools=[scrape_store],
    verbose=True
)

extraction_agent = Agent(
    role="Data Extractor",
    goal="Parse product data from scraped HTML and extract prices",
    backstory="Expert in parsing HTML and extracting structured product data including prices and discounts",
    tools=[extract_products],
    verbose=True
)

ranking_agent = Agent(
    role="Deal Ranker",
    goal="Rank deals by value using deal_score algorithm",
    backstory="Expert in ranking algorithms and deal valuation for North Macedonia market",
    tools=[calculate_score],
    verbose=True
)

rag_agent = Agent(
    role="Search Assistant",
    goal="Answer user queries using RAG pipeline with ChromaDB",
    backstory="Expert in vector search and natural language processing for deal discovery",
    tools=[],
    verbose=True
)

verification_agent = Agent(
    role="Discount Validator",
    goal="Detect fake or misleading discounts",
    backstory="Expert in price history analysis and discount verification",
    tools=[],
    verbose=True
)

# TASKS

scrape_task = Task(
    description="Scrape deals from store {store}",
    agent=scraper_agent,
    expected_output="Raw HTML with deals"
)

extract_task = Task(
    description="Extract product names and prices from HTML",
    agent=extraction_agent,
    expected_output="JSON array of products"
)

rank_task = Task(
    description="Calculate deal scores for extracted products",
    agent=ranking_agent,
    expected_output="Deal scores"
)

# CREW

deal_scraping_crew = Crew(
    agents=[scraper_agent, extraction_agent, ranking_agent],
    tasks=[scrape_task, extract_task, rank_task],
    verbose=True
)

if __name__ == "__main__":
    result = deal_scraping_crew.kickoff(inputs={"store": "neptun"})
    print(result)
