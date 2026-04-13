"""
PHASE 6: VECTOR DATABASE SETUP
ChromaDB for RAG search
"""

import chromadb
from chromadb.config import Settings
import os

CHROMA_PATH = "/workspace/mk-black-friday-radar/rag/chroma_db"

class ChromaManager:
    def __init__(self):
        os.makedirs(CHROMA_PATH, exist_ok=True)
        self.client = chromadb.PersistentClient(
            path=CHROMA_PATH,
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Create collections
        self.deals_collection = self.client.get_or_create_collection("deals")
        self.products_collection = self.client.get_or_create_collection("products")
        self.stores_collection = self.client.get_or_create_collection("stores")
        
    def add_deal(self, deal_id, product_name, description, category, store):
        """Add deal to vector database for semantic search"""
        text = f"{product_name} {description} {category} {store}"
        self.deals_collection.add(
            ids=[str(deal_id)],
            documents=[text],
            metadatas=[{
                "product_name": product_name,
                "category": category,
                "store": store
            }]
        )
    
    def search_deals(self, query, n_results=10):
        """Search deals using vector similarity"""
        results = self.deals_collection.query(
            query_texts=[query],
            n_results=n_results
        )
        return results
    
    def add_product(self, product_id, name, description, category):
        """Add product to vector database"""
        text = f"{name} {description} {category}"
        self.products_collection.add(
            ids=[str(product_id)],
            documents=[text],
            metadatas=[{"name": name, "category": category}]
        )

if __name__ == "__main__":
    manager = ChromaManager()
    print("✅ ChromaDB initialized")
    print(f"📁 Database path: {CHROMA_PATH}")
