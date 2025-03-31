import dotenv from "dotenv";
import neo4j from "neo4j-driver";
dotenv.config();

// Connect to Neo4j
const driver = neo4j.driver(
    process.env.NEO4J_URI as string,
    neo4j.auth.basic(
        process.env.NEO4J_USER as string,
        process.env.NEO4J_PASSWORD as string
    )
);


export async function RunQuery(query: string, parameters?: any) {
    const session = driver.session({ database: process.env.NEO4J_DATABASE });

    const PromisingFunction = async (query: string) => {
        try {
            const result = await session.run(query, parameters);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        }
        finally{
            session.close()
        }
    };
    const data = await PromisingFunction(query);
    return data;
}
