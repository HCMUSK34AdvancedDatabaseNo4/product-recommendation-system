import { RunQuery } from "../db_connect"


export class ProductModel {
    constructor() {

    }
    static async get_recommandations(id: number) {
        const query = `
        MATCH (u:User {user_id:'${id}'})
        OPTIONAL MATCH (u)-[:ORDERED]->(o:Order)-[:CONTAINS]->(p:Product)
        WITH COLLECT(DISTINCT p) + COLLECT(DISTINCT p2) as products, u
        UNWIND products as product
        MATCH (otherUser:User)-[:ORDERED|HAS_IN_CART]->(p3:Product)
        WHERE NOT (u)-[:ORDERED|HAS_IN_CART]->(p3) AND p3.id <> product.id
        WITH DISTINCT p3, COUNT(DISTINCT otherUser) as similarity 
        ORDER BY similarity DESC
        RETURN p3 LIMIT 12`
        const result = await RunQuery(query);
        return result?.records.map((record) => record.get("p3"));
    }

    static async getRecommendationByUserId(userId: number) {
        const query =
            `
            MATCH (u:User {user_id: $userId})-[:ORDERED]->(:Order)-[:CONTAINS]->(p:Product)-[:BELONGS_TO]->(c:Category)
            MATCH (otherUser:User)-[:ORDERED]->(:Order)-[:CONTAINS]->(recommendedProduct:Product)-[:BELONGS_TO]->(c)
            WHERE NOT (u)-[:ORDERED]->(:Order)-[:CONTAINS]->(recommendedProduct) 
            AND otherUser <> u
            RETURN recommendedProduct AS product, c AS category, COUNT(DISTINCT otherUser) AS score
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
            RETURN hotProduct AS product, NULL AS category, orderCount AS score
            LIMIT 10;
        `

        console.log("Query: ", query);
        console.log("Parameters: ", { userId });
        const result = await RunQuery(query, { userId });
        console.log("Result: ", result);
        return result?.records.map((record) => {
            return {
                product: record.get("recommendedProduct"),
                category: record.get("c")
            }
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

            // Separate WITH clause to avoid aggregation issues
            WITH REDUCE(output = [], r IN coPurchaseRecommendations | output + r) + 
                REDUCE(output = [], r IN categoryRecommendations | output + r) AS allRecommendations

            UNWIND allRecommendations AS finalRecommendation

            // Rank by frequency of occurrence
            RETURN DISTINCT finalRecommendation, COUNT(*) AS score
            ORDER BY score DESC
            LIMIT 10;
        `

        console.log("Query: ", query);
        console.log("Parameters: ", { productId });
        const result = await RunQuery(query, { productId });
        console.log("Result: ", result);
        return result?.records.map((record) => {
            return {
                product: record.get("recommendedProduct"),
            }
        });
    }
}