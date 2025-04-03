import { RunQuery } from "../db_connect"
import { NotFoundError } from "../helpers/error-handler";
import { ProductModel } from "../models";
import { ProductCategoryModel } from "../models/product-category.model";


export class ProductRepository {
    constructor() {

    }

    private static transformProductModel(properties: any): ProductModel {
       return new ProductModel({
            id: properties.product_id,
            productName: properties.productName,
            description: properties.description,
            price: properties.price,
            images: properties.images
        })
    }

    static async getAllProducts() {
        const query = `
            MATCH (p:Product)-[:BELONGS_TO]->(c:Category)
            RETURN p, c
        `
        const result = await RunQuery(query);
        return result?.records.map((record) => {
            const product = record.get("p")
            const category = record.get("c")
            return {
                product: ProductRepository.transformProductModel(product.properties),
                category: new ProductCategoryModel({
                    id: category.properties.category_id,
                    categoryName: category.properties.name,
                })
            }
        });
    }

    static async getProductById(productId: string) {
        const query = `
            MATCH (p:Product {product_id: $productId})-[:BELONGS_TO]->(c:Category)
            RETURN p, COLLECT(c) AS categories
        `
        const result = await RunQuery(query, { productId });
        return result?.records.map((record) => {
            const product = record.get("p")
            const categories = record.get("categories")
            return {
                product: ProductRepository.transformProductModel(product.properties),
                categories: categories.map((category: any) => {
                    return new ProductCategoryModel({
                        id: category.properties.category_id,
                        categoryName: category.properties.name,
                        description: category.properties.description,
                    })
                })
            }
        });
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
            return ProductRepository.transformProductModel(product.properties)
        });
    }


    static async getRecommendationByProductId(productId: string): Promise<{ product: ProductModel; categories: ProductCategoryModel[]; }[]> {
        const query =
        `
            MATCH (p:Product {product_id: $productId})-[:BELONGS_TO]->(c:Category)

            // Find category-based recommendations
            OPTIONAL MATCH (recommended:Product)-[:BELONGS_TO]->(c)
            WHERE recommended <> p
            WITH COLLECT(DISTINCT recommended) AS categoryRecommendations, p, c

            // Find frequently co-purchased products
            OPTIONAL MATCH (:User)-[:ORDERED]->(:Order)-[:CONTAINS]->(p)
            MATCH (:User)-[:ORDERED]->(:Order)-[:CONTAINS]->(coPurchased:Product)
            WHERE coPurchased <> p
            WITH categoryRecommendations, COLLECT(DISTINCT coPurchased) AS coPurchaseRecommendations, c

            // Assign weights: Category products get priority by repeating them
            WITH categoryRecommendations + categoryRecommendations AS boostedCategoryRecommendations, coPurchaseRecommendations, c

            // Merge both lists, ensuring category-based appear first
            WITH boostedCategoryRecommendations + coPurchaseRecommendations AS allRecommendations, c

            UNWIND allRecommendations AS recommendedProduct

            // Retrieve the categories for each recommended product
            OPTIONAL MATCH (recommendedProduct)-[:BELONGS_TO]->(recCategory:Category)

            // Rank by frequency of occurrence
            RETURN DISTINCT recommendedProduct, COLLECT(DISTINCT recCategory) AS categories, COUNT(*) AS score
            ORDER BY score DESC
            LIMIT 10;
        `
        const result = await RunQuery(query, { productId });
        return result?.records.map((record) => {
            const product = record.get("recommendedProduct")
            const categories = record.get("categories")
            return {
                product: ProductRepository.transformProductModel(product.properties),
                categories: categories.map((category: any) => {
                    return new ProductCategoryModel({
                        id: category.properties.category_id,
                        categoryName: category.properties.categoryName,
                        description: category.properties.description,
                    })
                })
            }
        });
    }

    static async addProduct(product: ProductModel) {
        const query = `
            MERGE (p:Product {
                product_id: $productId,
                name: $name,
                description: $description,
                price: $price
            })
            RETURN p
        `
        const result = await RunQuery(query, {
            productId: product.id,
            productName: product.productName,
            description: product.description,
            price: product.price
        });
        return result?.records.map((record) => {
            const product = record.get("p")
            return ProductRepository.transformProductModel(product.properties)
        });
    }
}