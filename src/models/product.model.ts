import { RunQuery } from "../db_connect"


export class Product {
    constructor() {

    }
    static async get_recommandations(id: number) {
        const query = `MATCH (u:User {id:'${id}'})
        OPTIONAL MATCH (u)-[:HAS_IN_CART]->(p:Product)
        OPTIONAL MATCH (u)-[:PLACED_ORDER]->(o:Order)-[:INCLUDES]->(p2:Product)
        WITH COLLECT(DISTINCT p) + COLLECT(DISTINCT p2) as products, u
        UNWIND products as product
        MATCH (otherUser:User)-[:PLACED_ORDER|HAS_IN_CART]->(p3:Product)
        WHERE NOT (u)-[:PLACED_ORDER|HAS_IN_CART]->(p3) AND p3.id <> product.id 
        OR (p3.cpu = product.cpu OR p3.gpu = product.gpu OR p3.brand = product.brand)
        WITH DISTINCT p3, COUNT(DISTINCT otherUser) as similarity 
        ORDER BY similarity DESC
        RETURN p3 LIMIT 12`
        const result = await RunQuery(query);
        return result?.records.map((record) => record.get("p3"));
    }
}