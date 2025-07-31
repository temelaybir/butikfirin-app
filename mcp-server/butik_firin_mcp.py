#!/usr/bin/env python3
"""
Butik Fırın MCP Server
Pastane/Fırın e-ticaret projesine özel MCP server implementasyonu
"""

import json
import sqlite3
import os
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from pathlib import Path

class ButikFirinMCP:
    """Butik Fırın projesine özel MCP server"""
    
    def __init__(self, project_root: str = "E:\\butikfirin-app"):
        self.project_root = Path(project_root)
        self.db_path = self.project_root / "dev.db"
        self.uploads_dir = self.project_root / "public" / "uploads"
        self.backup_dir = self.project_root / "backups"
        
        # Logs setup
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger("ButikFirinMCP")
        
        # Categories configuration
        self.categories = {
            "kekler-muffinler": {
                "name": "Kekler & Muffinler",
                "price_range": [15, 50],
                "typical_products": ["brownie", "cupcake", "muffin", "kek"]
            },
            "kurabiyeler": {
                "name": "Kurabiyeler", 
                "price_range": [20, 40],
                "typical_products": ["tereyağlı kurabiye", "cookie", "bisküvi"]
            },
            "pastalar": {
                "name": "Pastalar",
                "price_range": [100, 500], 
                "typical_products": ["doğum günü pastası", "yaş pasta", "tiramisu"]
            },
            "tatlilar": {
                "name": "Tatlılar",
                "price_range": [15, 45],
                "typical_products": ["sütlaç", "kazandibi", "profiterol"]
            },
            "ekmekler": {
                "name": "Ekmekler",
                "price_range": [5, 25], 
                "typical_products": ["ekmek", "poğaça", "simit"]
            },
            "icecekler": {
                "name": "İçecekler",
                "price_range": [10, 30],
                "typical_products": ["kahve", "çay", "meyve suyu"]
            },
            "borekler-tuzlular": {
                "name": "Börekler & Tuzlular",
                "price_range": [12, 35],
                "typical_products": ["su böreği", "sigara böreği", "açma"]
            },
            "ozel-siparisler": {
                "name": "Özel Siparişler", 
                "price_range": [150, 1000],
                "typical_products": ["özel pasta", "event catering", "toplu sipariş"]
            }
        }
        
        self._ensure_directories()
        self._init_database()
    
    def _ensure_directories(self):
        """Gerekli klasörleri oluştur"""
        self.uploads_dir.mkdir(parents=True, exist_ok=True)
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        
        # Kategori alt klasörleri
        for category_id in self.categories.keys():
            (self.uploads_dir / category_id).mkdir(exist_ok=True)
    
    def _init_database(self):
        """SQLite database'i başlat"""
        if not self.db_path.exists():
            self.logger.info("Creating new SQLite database...")
            self._create_database_schema()
        else:
            self.logger.info("Using existing SQLite database")
    
    def _create_database_schema(self):
        """Database şemasını oluştur"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Categories table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS categories (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    price_range_min REAL,
                    price_range_max REAL,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Products table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS products (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    slug TEXT UNIQUE,
                    description TEXT,
                    short_description TEXT,
                    price REAL NOT NULL,
                    compare_price REAL,
                    category_id TEXT,
                    stock_quantity INTEGER DEFAULT 0,
                    sku TEXT UNIQUE,
                    is_active BOOLEAN DEFAULT TRUE,
                    is_featured BOOLEAN DEFAULT FALSE,
                    images TEXT, -- JSON array
                    tags TEXT,   -- JSON array
                    ingredients TEXT, -- Pastane için özel
                    allergens TEXT,   -- Alerjenik maddeler
                    shelf_life_days INTEGER, -- Raf ömrü
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories (id)
                )
            """)
            
            # Orders table  
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS orders (
                    id TEXT PRIMARY KEY,
                    customer_name TEXT NOT NULL,
                    customer_email TEXT,
                    customer_phone TEXT,
                    delivery_address TEXT,
                    items TEXT NOT NULL, -- JSON array
                    total_amount REAL NOT NULL,
                    status TEXT DEFAULT 'pending',
                    payment_method TEXT,
                    delivery_date DATE,
                    special_instructions TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Site settings table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS site_settings (
                    key TEXT PRIMARY KEY,
                    value TEXT,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            conn.commit()
            self.logger.info("Database schema created successfully")
            
            # Seed initial data
            self._seed_initial_data(cursor)
            conn.commit()
    
    def _seed_initial_data(self, cursor):
        """İlk veriyi ekle"""
        # Categories
        for cat_id, cat_data in self.categories.items():
            cursor.execute("""
                INSERT OR IGNORE INTO categories 
                (id, name, description, price_range_min, price_range_max)
                VALUES (?, ?, ?, ?, ?)
            """, (
                cat_id,
                cat_data["name"],
                f"{cat_data['name']} kategorisi",
                cat_data["price_range"][0],
                cat_data["price_range"][1]
            ))
        
        # Site settings
        settings = [
            ("site_name", "Butik Fırın"),
            ("site_description", "Ev yapımı lezzetler, taze pastalar ve özel günler için muhteşem tatlılar"),
            ("currency", "TRY"),
            ("currency_symbol", "₺"),
            ("tax_rate", "18.0"),
            ("free_shipping_threshold", "100.0")
        ]
        
        for key, value in settings:
            cursor.execute("""
                INSERT OR IGNORE INTO site_settings (key, value) VALUES (?, ?)
            """, (key, value))
    
    # MCP Tool Methods
    
    def bakery_get_categories(self) -> Dict[str, Any]:
        """Pastane kategorilerini getir"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    SELECT id, name, description, price_range_min, price_range_max, is_active
                    FROM categories WHERE is_active = TRUE
                    ORDER BY name
                """)
                
                categories = []
                for row in cursor.fetchall():
                    categories.append({
                        "id": row[0],
                        "name": row[1], 
                        "description": row[2],
                        "price_range": [row[3], row[4]],
                        "is_active": row[5]
                    })
                
                return {"success": True, "data": categories}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def bakery_get_products(self, category_id: Optional[str] = None, limit: int = 50) -> Dict[str, Any]:
        """Pastane ürünlerini getir"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                if category_id:
                    cursor.execute("""
                        SELECT id, name, slug, description, price, category_id, 
                               stock_quantity, is_active, is_featured, images
                        FROM products 
                        WHERE category_id = ? AND is_active = TRUE
                        ORDER BY name LIMIT ?
                    """, (category_id, limit))
                else:
                    cursor.execute("""
                        SELECT id, name, slug, description, price, category_id,
                               stock_quantity, is_active, is_featured, images
                        FROM products 
                        WHERE is_active = TRUE
                        ORDER BY name LIMIT ?
                    """, (limit,))
                
                products = []
                for row in cursor.fetchall():
                    products.append({
                        "id": row[0],
                        "name": row[1],
                        "slug": row[2],
                        "description": row[3],
                        "price": row[4],
                        "category_id": row[5],
                        "stock_quantity": row[6],
                        "is_active": row[7],
                        "is_featured": row[8],
                        "images": json.loads(row[9]) if row[9] else []
                    })
                
                return {"success": True, "data": products, "count": len(products)}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def bakery_suggest_pricing(self, category_id: str, base_cost: float) -> Dict[str, Any]:
        """Kategori ve maliyet bazında fiyat öner"""
        try:
            if category_id not in self.categories:
                return {"success": False, "error": "Geçersiz kategori"}
            
            category = self.categories[category_id]
            price_range = category["price_range"]
            
            # %40 markup + minimum %25 kar marjı
            suggested_price = base_cost * 1.40
            min_price = base_cost * 1.25
            
            # Kategori aralığına uygunluk kontrolü
            if suggested_price < price_range[0]:
                suggested_price = price_range[0]
            elif suggested_price > price_range[1]:
                suggested_price = price_range[1]
            
            return {
                "success": True,
                "data": {
                    "base_cost": base_cost,
                    "suggested_price": round(suggested_price, 2),
                    "min_price": round(min_price, 2),
                    "category_range": price_range,
                    "markup_percentage": 40,
                    "profit_margin": round(((suggested_price - base_cost) / suggested_price) * 100, 1)
                }
            }
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def bakery_generate_product_description(self, product_name: str, category_id: str, 
                                          ingredients: List[str] = None) -> Dict[str, Any]:
        """Ürün açıklaması oluştur"""
        try:
            if category_id not in self.categories:
                return {"success": False, "error": "Geçersiz kategori"}
            
            category = self.categories[category_id]
            templates = {
                "kekler-muffinler": "Ev yapımı {name}, yumuşacık dokusu ve {ingredients} ile hazırlanmış. Her lokmada taze lezzet.",
                "kurabiyeler": "Çıtır çıtır {name}, geleneksel tarifimizle {ingredients} kullanılarak özenle pişirilmiş.",
                "pastalar": "Özel günleriniz için hazırlanmış {name}. {ingredients} ile muhteşem bir lezzet deneyimi.",
                "tatlilar": "Geleneksel {name}, ev usulü {ingredients} ile hazırlanmış nostaljik lezzet.",
                "ekmekler": "Günlük taze {name}, doğal {ingredients} ile sabah fırından çıkan sıcacık lezzet.",
                "icecekler": "Ferahlatıcı {name}, {ingredients} ile hazırlanmış doğal içecek.",
                "borekler-tuzlular": "El açması {name}, taze {ingredients} ile hazırlanmış geleneksel lezzet.",
                "ozel-siparisler": "Size özel hazırlanan {name}, {ingredients} ile unutulmaz anılar için."
            }
            
            template = templates.get(category_id, "Lezzetli {name}, kaliteli {ingredients} ile hazırlanmış.")
            ingredients_str = ", ".join(ingredients) if ingredients else "kaliteli malzemeler"
            
            description = template.format(name=product_name, ingredients=ingredients_str)
            short_description = f"{category['name']} kategorisinden {product_name}"
            
            return {
                "success": True,
                "data": {
                    "description": description,
                    "short_description": short_description,
                    "category": category["name"],
                    "suggested_tags": [product_name.lower(), category_id, "ev yapımı", "taze"]
                }
            }
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def bakery_backup_database(self) -> Dict[str, Any]:
        """Database yedekle"""
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_filename = f"butik_firin_backup_{timestamp}.db"
            backup_path = self.backup_dir / backup_filename
            
            # SQLite backup
            with sqlite3.connect(self.db_path) as source:
                with sqlite3.connect(backup_path) as backup:
                    source.backup(backup)
            
            return {
                "success": True,
                "data": {
                    "backup_file": str(backup_path),
                    "timestamp": timestamp,
                    "size_mb": round(backup_path.stat().st_size / (1024*1024), 2)
                }
            }
        except Exception as e:
            return {"success": False, "error": str(e)}

# CLI Interface için
if __name__ == "__main__":
    import sys
    
    mcp = ButikFirinMCP()
    
    if len(sys.argv) < 2:
        print("Kullanım: python butik_firin_mcp.py <command> [args]")
        print("Komutlar: categories, products, suggest_price, backup")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "categories":
        result = mcp.bakery_get_categories()
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    elif command == "products":
        category_id = sys.argv[2] if len(sys.argv) > 2 else None
        result = mcp.bakery_get_products(category_id)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    elif command == "suggest_price":
        if len(sys.argv) < 4:
            print("Kullanım: suggest_price <category_id> <base_cost>")
            sys.exit(1)
        category_id = sys.argv[2]
        base_cost = float(sys.argv[3])
        result = mcp.bakery_suggest_pricing(category_id, base_cost)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    elif command == "backup":
        result = mcp.bakery_backup_database()
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    else:
        print(f"Bilinmeyen komut: {command}") 