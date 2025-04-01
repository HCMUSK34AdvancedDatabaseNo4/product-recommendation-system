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
MERGE (:Product {product_id: "P001", name: "MacBook Pro", brand: "Apple", price: 2000})-[:BELONGS_TO]->(c)
MERGE (:Product {product_id: "P002", name: "Dell XPS 15", brand: "Dell", price: 1800})-[:BELONGS_TO]->(c)
MERGE (:Product {product_id: "P003", name: "Asus ROG Strix", brand: "Asus", price: 2200})-[:BELONGS_TO]->(c)
MERGE (:Product {product_id: "P004", name: "HP Spectre x360", brand: "HP", price: 1700})-[:BELONGS_TO]->(c)

// Smartphones
MERGE (c2:Category {name: "Smartphones"})
MERGE (:Product {product_id: "P005", name: "iPhone 14", brand: "Apple", price: 1200})-[:BELONGS_TO]->(c2)
MERGE (:Product {product_id: "P006", name: "Samsung Galaxy S23", brand: "Samsung", price: 1100})-[:BELONGS_TO]->(c2)
MERGE (:Product {product_id: "P007", name: "Google Pixel 7", brand: "Google", price: 900})-[:BELONGS_TO]->(c2)
MERGE (:Product {product_id: "P008", name: "OnePlus 11", brand: "OnePlus", price: 950})-[:BELONGS_TO]->(c2);

// Accessories
MERGE (c3:Category {name: "Accessories"})
MERGE (:Product {product_id: "P009", name: "AirPods Pro", brand: "Apple", price: 250})-[:BELONGS_TO]->(c3)
MERGE (:Product {product_id: "P010", name: "Sony WH-1000XM5", brand: "Sony", price: 400})-[:BELONGS_TO]->(c3)
MERGE (:Product {product_id: "P011", name: "Bose QuietComfort 45", brand: "Bose", price: 350})-[:BELONGS_TO]->(c3)

// Clothes
MERGE (c4:Category {name: "Clothes"})
MERGE (:Product {product_id: "P012", name: "Nike Air Hoodie", brand: "Nike", price: 80})-[:BELONGS_TO]->(c4)
MERGE (:Product {product_id: "P013", name: "Adidas Ultraboost T-Shirt", brand: "Adidas", price: 40})-[:BELONGS_TO]->(c4)
MERGE (:Product {product_id: "P014", name: "Levi's 501 Jeans", brand: "Levi's", price: 60})-[:BELONGS_TO]->(c4)
MERGE (:Product {product_id: "P015", name: "North Face Winter Jacket", brand: "The North Face", price: 150})-[:BELONGS_TO]->(c4)
MERGE (:Product {product_id: "P016", name: "Puma Running Shorts", brand: "Puma", price: 35})-[:BELONGS_TO]->(c4)
MERGE (:Product {product_id: "P017", name: "Under Armour Compression Shirt", brand: "Under Armour", price: 45})-[:BELONGS_TO]->(c4)
MERGE (:Product {product_id: "P018", name: "Gucci Leather Belt", brand: "Gucci", price: 250})-[:BELONGS_TO]->(c4)
MERGE (:Product {product_id: "P019", name: "H&M Cotton Sweatpants", brand: "H&M", price: 30})-[:BELONGS_TO]->(c4)

// Cosmetics
MERGE (c5:Category {name: "Cosmetics"})
MERGE (:Product {product_id: "P020", name: "L'Oreal Revitalift Cream", brand: "L'Oreal", price: 30})-[:BELONGS_TO]->(c5)
MERGE (:Product {product_id: "P021", name: "MAC Matte Lipstick", brand: "MAC", price: 25})-[:BELONGS_TO]->(c5)
MERGE (:Product {product_id: "P022", name: "Maybelline Fit Me Foundation", brand: "Maybelline", price: 15})-[:BELONGS_TO]->(c5)
MERGE (:Product {product_id: "P023", name: "Dior Sauvage Perfume", brand: "Dior", price: 120})-[:BELONGS_TO]->(c5)
MERGE (:Product {product_id: "P024", name: "Chanel No. 5 Perfume", brand: "Chanel", price: 150})-[:BELONGS_TO]->(c5)
MERGE (:Product {product_id: "P025", name: "NARS Radiant Concealer", brand: "NARS", price: 28})-[:BELONGS_TO]->(c5)
MERGE (:Product {product_id: "P026", name: "Clinique Moisture Surge", brand: "Clinique", price: 35})-[:BELONGS_TO]->(c5)
MERGE (:Product {product_id: "P027", name: "Fenty Beauty Highlighter", brand: "Fenty Beauty", price: 38})-[:BELONGS_TO]->(c5)

// Multi-category products
MATCH (c6:Category {name: "Accessories"}), (c7:Category {name: "Clothes"})
MERGE (p:Product {product_id: "P018"})-[:BELONGS_TO]->(c6)
MERGE (p)-[:BELONGS_TO]->(c7)

MATCH (c8:Category {name: "Cosmetics"}), (c9:Category {name: "Accessories"})
MERGE (p:Product {product_id: "P028", name: "Chanel Hand Cream", brand: "Chanel", price: 50})-[:BELONGS_TO]->(c8)
MERGE (p)-[:BELONGS_TO]->(c9)

MATCH (c10:Category {name: "Clothes"}), (c11:Category {name: "Accessories"})
MERGE (p:Product {product_id: "P029", name: "Nike Gym Gloves", brand: "Nike", price: 20})-[:BELONGS_TO]->(c10)
MERGE (p)-[:BELONGS_TO]->(c11)


// Orders for User 1
MATCH (u:User {user_id: 1})
MERGE (o:Order {order_id: 2})
MERGE (u)-[:ORDERED]->(o)
MERGE (p1:Product {product_id: "P005"})  // iPhone 14
MERGE (p2:Product {product_id: "P011"})  // Bose QuietComfort 45
MERGE (o)-[:CONTAINS]->(p1)
MERGE (o)-[:CONTAINS]->(p2)

MATCH (u:User {user_id: 1})
MERGE (o:Order {order_id: 7})
MERGE (u)-[:ORDERED]->(o)
MERGE (p1:Product {product_id: "P003"})  // Asus ROG Strix
MERGE (p2:Product {product_id: "P014"})  // Levi's 501 Jeans
MERGE (o)-[:CONTAINS]->(p1)
MERGE (o)-[:CONTAINS]->(p2)

// Orders for User 2
MATCH (u:User {user_id: 2})
MERGE (o:Order {order_id: 3})
MERGE (u)-[:ORDERED]->(o)
MERGE (p1:Product {product_id: "P010"})
MERGE (p2:Product {product_id: "P007"})
MERGE (o)-[:CONTAINS]->(p1)
MERGE (o)-[:CONTAINS]->(p2)

MATCH (u:User {user_id: 2})
MERGE (o:Order {order_id: 4})
MERGE (u)-[:ORDERED]->(o)
MERGE (p1:Product {product_id: "P006"})
MERGE (p2:Product {product_id: "P024"})
MERGE (o)-[:CONTAINS]->(p1)
MERGE (o)-[:CONTAINS]->(p2)

// Orders for User 3
MATCH (u:User {user_id: 3})
MERGE (o:Order {order_id: 5})
MERGE (u)-[:ORDERED]->(o)
MERGE (p1:Product {product_id: "P012"})
MERGE (p2:Product {product_id: "P016"})
MERGE (o)-[:CONTAINS]->(p1)
MERGE (o)-[:CONTAINS]->(p2)

MATCH (u:User {user_id: 3})
MERGE (o:Order {order_id: 6})
MERGE (u)-[:ORDERED]->(o)
MERGE (p1:Product {product_id: "P002"})
MERGE (p2:Product {product_id: "P017"})
MERGE (o)-[:CONTAINS]->(p1)
MERGE (o)-[:CONTAINS]->(p2)

// Orders for User 4
MATCH (u:User {user_id: 4})
MERGE (o:Order {order_id: 8})
MERGE (u)-[:ORDERED]->(o)
MERGE (p1:Product {product_id: "P004"})
MERGE (p2:Product {product_id: "P018"})
MERGE (o)-[:CONTAINS]->(p1)
MERGE (o)-[:CONTAINS]->(p2)

// View items
MATCH (u:User {user_id: 1})
MERGE (p:Product {product_id: "P010"})
MERGE (u)-[rel:VIEWED]->(p)
ON CREATE SET rel.count = 1
ON MATCH SET rel.count = rel.count + 1

// Supplier relationships
MATCH (s:User {user_id: 4}), (p:Product {product_id: "P016"})
CREATE (s)-[:SUPPLIES]->(p)

MATCH (s:User {user_id: 4}), (p:Product {product_id: "P013"}) 
CREATE (s)-[:SUPPLIES]->(p)

MATCH (s:User {user_id: 4}), (p:Product {product_id: "P012"})
CREATE (s)-[:SUPPLIES]->(p)

MATCH (s:User {user_id: 5}), (p:Product {product_id: "P021"})
CREATE (s)-[:SUPPLIES]->(p)

MATCH (s:User {user_id: 5}), (p:Product {product_id: "P023"})
CREATE (s)-[:SUPPLIES]->(p)