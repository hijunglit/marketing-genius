import { bigint, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const ai = pgTable("ai", {
  ai_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  profiles_id: uuid().references(() => profiles.profile_id),
  create_prompt: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
