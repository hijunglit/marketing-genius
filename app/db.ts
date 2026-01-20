import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, { prepare: false }); // prepare: false. because of connection pooling function. support supabase but drizzle not.

const db = drizzle(client);

export default db;
