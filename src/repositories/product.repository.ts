import { RunQuery } from "../db_connect"
import { NotFoundError } from "../helpers/error-handler";
import { ProductModel } from "../models";


export class ProductRepository {
    constructor() {

    }
    static async getRecommendationByUserId(userId: string) {
        const checkUserQuery = `
            MATCH (u:User {user_id: $userId})
            RETURN COUNT(u) AS userCount
        `;

        const userResult = await RunQuery(checkUserQuery, { userId });
        // If user does not exist, return an empty array or throw an error
        if (!userResult.records.length || userResult.records[0]?.get("userCount")?.toInt() === 0) {
            throw new NotFoundError(`User with ID ${userId} not found`);
        }
        const query =
            `
            MATCH (u:User {user_id: $userId})-[:ORDERED]->(:Order)-[:CONTAINS]->(p:Product)-[:BELONGS_TO]->(c:Category)
            MATCH (otherUser:User)-[:ORDERED]->(:Order)-[:CONTAINS]->(recommendedProduct:Product)-[:BELONGS_TO]->(c)
            WHERE NOT (u)-[:ORDERED]->(:Order)-[:CONTAINS]->(recommendedProduct) 
            AND otherUser <> u
            RETURN recommendedProduct AS recommendedProduct, COUNT(DISTINCT otherUser) AS score
            ORDER BY score DESC
            LIMIT 10

            UNION

            MATCH (:Order)-[:CONTAINS]->(hotProduct:Product)
            WHERE NOT EXISTS {
                MATCH (u:User {user_id: $userId})-[:ORDERED]->(:Order)-[:CONTAINS]->(hotProduct)
            }
            WITH hotProduct, COUNT(*) AS orderCount
            ORDER BY orderCount DESC
            LIMIT 10
            RETURN hotProduct AS recommendedProduct, orderCount AS score
            LIMIT 10;
        `

        const result = await RunQuery(query, { userId });
        return result?.records.map((record) => {
            const product = record.get("recommendedProduct")
            return new ProductModel({
                id: product.properties.product_id,
                name: product.properties.name,
                description: product.properties.description,
                price: product.properties.price,
            })
        });
    }


    static async getRecommendationByProductId(productId: string) {
        const query =
        `
           MATCH (p:Product {product_id: $productId})-[:BELONGS_TO]->(c:Category)
            
            // Find frequently co-purchased products
            OPTIONAL MATCH (:User)-[:ORDERED]->(:Order)-[:CONTAINS]->(p)
            MATCH (:User)-[:ORDERED]->(:Order)-[:CONTAINS]->(coPurchased:Product)
            WHERE coPurchased <> p
            WITH COLLECT(DISTINCT coPurchased) AS coPurchaseRecommendations, c, p

            // Find category-based recommendations
            OPTIONAL MATCH (recommended:Product)-[:BELONGS_TO]->(c)
            WHERE recommended <> p
            WITH coPurchaseRecommendations, COLLECT(DISTINCT recommended) AS categoryRecommendations

            // Combine the two lists, placing category recommendations first
            WITH REDUCE(output = [], r IN categoryRecommendations | output + r) +
                REDUCE(output = [], r IN coPurchaseRecommendations | output + r) AS allRecommendations

            UNWIND allRecommendations AS recommendedProduct

            // Rank by frequency of occurrence
            RETURN DISTINCT recommendedProduct, COUNT(*) AS score
            ORDER BY score DESC
            LIMIT 10;
        `
        const result = await RunQuery(query, { productId });
        return result?.records.map((record) => {
            const product = record.get("recommendedProduct")
            return new ProductModel({
                id: product.properties.product_id,
                name: product.properties.name,
                description: product.properties.description,
                price: product.properties.price,
            })
        });
    }
}