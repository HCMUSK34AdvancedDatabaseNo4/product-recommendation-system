import neo4j from 'neo4j-driver';
import fs from 'fs';
import dotenv from "dotenv";

dotenv.config();

// Load JSON data
const data = JSON.parse(fs.readFileSync('data/data.json', 'utf-8'));


// Connect to Neo4j database
const driver = neo4j.driver(
    process.env.NEO4J_URI as string,
    neo4j.auth.basic(
        process.env.NEO4J_USER as string,
        process.env.NEO4J_PASSWORD as string
    )
);
const session = driver.session({ database: process.env.NEO4J_DATABASE });
async function importData() {
    try {
        // Import Categories
        for (const category of data.categories) {
            await session.run(
                `MERGE (c:Category {category_id: $id}) SET c.categoryName = $categoryName`,
                category
            );
        }

        // Import Products
        for (const product of data.products) {
        await session.run(
            `MERGE (p:Product {product_id: $id})
                SET p.productName = $productName, p.description = $description, p.price = $price, p.images = $images`,
            product
        );

        // Link products to categories
        for (const categoryName of product.categories) {
            await session.run(
                `MATCH (p:Product {product_id: $product_id}), (c:Category {categoryName: $categoryName})
                    MERGE (p)-[:BELONGS_TO]->(c)`,
                { product_id: product.id, categoryName: categoryName }
            );
        }
    }

    // Import Users
    for (const user of data.users) {
        await session.run(
            `MERGE (u:User {user_id: $user_id})
                SET u.name = $name, u.role = COALESCE($role, u.role)`,
            user
        );
    }

    // Import Orders
    for (const order of data.orders) {
        await session.run(
            `MERGE (o:Order {order_id: $order_id})`,
            order
        );

        await session.run(
            `MATCH (u:User {user_id: $user_id}), (o:Order {order_id: $order_id})
                MERGE (u)-[:ORDERED]->(o)`,
            order
        );

        for (const productId of order.products) {
            await session.run(
                `MATCH (o:Order {order_id: $order_id}), (p:Product {product_id: $product_id})
                    MERGE (o)-[:CONTAINS]->(p)`,
                { order_id: order.order_id, product_id: productId }
            );
        }
    }
    console.log('Data import complete!');
} catch (error) {
    console.error('Error importing data:', error);
} finally {
    await session.close();
    await driver.close();
}
}

importData()