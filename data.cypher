// Users
MERGE (:User {name: "Alice", user_id: 1});
MERGE (:User {name: "Bob", user_id: 2});
MERGE (:User {name: "Charlie", user_id: 3});
MERGE (:User {name: "David", user_id: 4, role: "supplier"});
MERGE (:User {name: "Eve", user_id: 5, role: "supplier"});

// Categories
MERGE (:Category {name: "Laptops"});
MERGE (:Category {name: "Smartphones"});
MERGE (:Category {name: "Headphones"});
MERGE (:Category {name: "Tablets"});
MERGE (:Category {name: "Gaming Consoles"});
MERGE (:Category {name: "Smartwatches"});
MERGE (:Category {name: "Cameras"});
MERGE (:Category {name: "TVs"});
MERGE (:Category {name: "Monitors"});
MERGE (:Category {name: "Accessories"});
MERGE (:Category {name: "Clothes"});
MERGE (:Category {name: "Cosmetics"});


// Laptops
MERGE (c:Category {name: "Laptops"})
MERGE (:Product {name: "MacBook Pro", brand: "Apple", price: 2000})-[:BELONGS_TO]->(c)
MERGE (:Product {name: "Dell XPS 15", brand: "Dell", price: 1800})-[:BELONGS_TO]->(c)
MERGE (:Product {name: "Asus ROG Strix", brand: "Asus", price: 2200})-[:BELONGS_TO]->(c)
MERGE (:Product {name: "HP Spectre x360", brand: "HP", price: 1700})-[:BELONGS_TO]->(c)

// Smartphones
MERGE (c:Category {name: "Smartphones"})
MERGE (:Product {name: "iPhone 14", brand: "Apple", price: 1200})-[:BELONGS_TO]->(c)
MERGE (:Product {name: "Samsung Galaxy S23", brand: "Samsung", price: 1100})-[:BELONGS_TO]->(c)
MERGE (:Product {name: "Google Pixel 7", brand: "Google", price: 900})-[:BELONGS_TO]->(c)
MERGE (:Product {name: "OnePlus 11", brand: "OnePlus", price: 950})-[:BELONGS_TO]->(c)

// Accessories
MERGE (c:Category {name: "Accessories"})
MERGE (:Product {name: "AirPods Pro", brand: "Apple", price: 250})-[:BELONGS_TO]->(c)
MERGE (:Product {name: "Sony WH-1000XM5", brand: "Sony", price: 400})-[:BELONGS_TO]->(c)
MERGE (:Product {name: "Bose QuietComfort 45", brand: "Bose", price: 350})-[:BELONGS_TO]->(c)

MATCH (c:Category {name: "Clothes"})
MERGE (:Product {name: "Nike Air Hoodie", brand: "Nike", price: 80})-[:BELONGS_TO]->(c),
       (:Product {name: "Adidas Ultraboost T-Shirt", brand: "Adidas", price: 40})-[:BELONGS_TO]->(c),
       (:Product {name: "Levi's 501 Jeans", brand: "Levi's", price: 60})-[:BELONGS_TO]->(c),
       (:Product {name: "North Face Winter Jacket", brand: "The North Face", price: 150})-[:BELONGS_TO]->(c),
       (:Product {name: "Puma Running Shorts", brand: "Puma", price: 35})-[:BELONGS_TO]->(c),
       (:Product {name: "Under Armour Compression Shirt", brand: "Under Armour", price: 45})-[:BELONGS_TO]->(c),
       (:Product {name: "Gucci Leather Belt", brand: "Gucci", price: 250})-[:BELONGS_TO]->(c),
       (:Product {name: "H&M Cotton Sweatpants", brand: "H&M", price: 30})-[:BELONGS_TO]->(c);

MATCH (c:Category {name: "Cosmetics"})
CREATE (:Product {name: "L'Oreal Revitalift Cream", brand: "L'Oreal", price: 30})-[:BELONGS_TO]->(c),
       (:Product {name: "MAC Matte Lipstick", brand: "MAC", price: 25})-[:BELONGS_TO]->(c),
       (:Product {name: "Maybelline Fit Me Foundation", brand: "Maybelline", price: 15})-[:BELONGS_TO]->(c),
       (:Product {name: "Dior Sauvage Perfume", brand: "Dior", price: 120})-[:BELONGS_TO]->(c),
       (:Product {name: "Chanel No. 5 Perfume", brand: "Chanel", price: 150})-[:BELONGS_TO]->(c),
       (:Product {name: "NARS Radiant Concealer", brand: "NARS", price: 28})-[:BELONGS_TO]->(c),
       (:Product {name: "Clinique Moisture Surge", brand: "Clinique", price: 35})-[:BELONGS_TO]->(c),
       (:Product {name: "Fenty Beauty Highlighter", brand: "Fenty Beauty", price: 38})-[:BELONGS_TO]->(c);


MATCH (c1:Category {name: "Accessories"}), (c2:Category {name: "Clothes"})
MERGE (p:Product {name: "Gucci Leather Belt", brand: "Gucci", price: 250})-[:BELONGS_TO]->(c1)
MERGE (p)-[:BELONGS_TO]->(c2);

MATCH (c1:Category {name: "Cosmetics"}), (c2:Category {name: "Accessories"})
MERGE (p:Product {name: "Chanel Hand Cream", brand: "Chanel", price: 50})-[:BELONGS_TO]->(c1)
MERGE       (p)-[:BELONGS_TO]->(c2);

MATCH (c1:Category {name: "Clothes"}), (c2:Category {name: "Accessories"})
MERGE (p:Product {name: "Nike Gym Gloves", brand: "Nike", price: 20})-[:BELONGS_TO]->(c1)
MERGE (p)-[:BELONGS_TO]->(c2);


// Orders
MERGE (u:User {user_id: 1}), (p:Product {name: "MacBook Pro"})
CREATE (u)-[:ORDERED]->(:Order)-[:CONTAINS]->(p);

MERGE (u:User {user_id: 2}), (p:Product {name: "iPhone 14"})
CREATE (u)-[:ORDERED]->(:Order)-[:CONTAINS]->(p);

// View items
MERGE (u:User {user_id: 1})
MERGE (p:Product {name: "Sony WH-1000XM5"})
MERGE (u)-[rel:VIEWED]->(p)
ON CREATE SET rel.count = 1
ON MATCH SET rel.count = rel.count +1


// Supplier 
MATCH (s:User {user_id: 4}), (p:Product {name: "Samsung T7 SSD"})
CREATE (s)-[:SUPPLIES]->(p);

MATCH (s:User {user_id: 4}), (p:Product {name: "Logitech MX Master 3"})
CREATE (s)-[:SUPPLIES]->(p);

MATCH (s:User {user_id: 4}), (p:Product {name: "Gucci Leather Belt"})
CREATE (s)-[:SUPPLIES]->(p);

MATCH (s:User {user_id: 4}), (p:Product {name: "Nike Air Hoodie"})
CREATE (s)-[:SUPPLIES]->(p);

MATCH (s:User {user_id: 5}), (p:Product {name: "MAC Matte Lipstick"})
CREATE (s)-[:SUPPLIES]->(p);

MATCH (s:User {user_id: 5}), (p:Product {name: "Dior Sauvage Perfume"})
CREATE (s)-[:SUPPLIES]->(p);