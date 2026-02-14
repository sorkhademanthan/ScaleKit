import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = global as unknown as { conn: Pool | undefined };

export const conn = globalForDb.conn ?? new Pool({
    connectionString: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });

// Helper to check connection health with a simple query
export async function checkDbConnection(): Promise<boolean> {
    try {
        const client = await conn.connect();
        client.release();
        return true;
    } catch (error) {
        console.warn("Database connection failed:", error);
        return false;
    }
}
