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
                `MERGE (c:Category {category_id: $category_id}) SET c.name = $name`,
                category
            );
        }

        // Import Products
        for (const product of data.products) {
        await session.run(
            `MERGE (p:Product {product_id: $product_id})
                SET p.name = $name, p.description = $description, p.price = $price`,
            product
        );

        // Link products to categories
        for (const categoryId of product.category_ids) {
            await session.run(
                `MATCH (p:Product {product_id: $product_id}), (c:Category {category_id: $category_id})
                    MERGE (p)-[:BELONGS_TO]->(c)`,
                { product_id: product.product_id, category_id: categoryId }
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