import { bigint, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const ai = pgTable("ai", {
  ai_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  profiles_id: uuid().references(() => profiles.profile_id),
  company_name: text().notNull(),
  category: text().notNull(),
  core_service: text().notNull(),
  company_description: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
