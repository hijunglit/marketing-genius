import { bigint, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const contents = pgTable("contents", {
  user_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  nme: text().notNull(),
  username: text().notNull(),
  avatar_url: text().notNull().default("https://github.com/elon-musk.png"),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
