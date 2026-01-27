import {
  bigint,
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";
import { ai } from "../marketer/schema";

export const contents = pgTable("contents", {
  contents_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  text: text().notNull(),
  hashtag: text().notNull(),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export const images = pgTable("images", {
  image_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  image_url: text().notNull(),
  contents_id: bigint({ mode: "number" }).references(
    () => contents.contents_id
  ),
});

export const requestContents = pgTable("request_contents", {
  request_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  contents_id: bigint({ mode: "number" }).references(
    () => contents.contents_id
  ),
  profile_id: uuid()
    .references(() => profiles.profile_id)
    .notNull(),
  ai_id: bigint({ mode: "number" })
    .references(() => ai.ai_id)
    .notNull(),
  title: text().notNull(),
  platform: text().notNull(),
  template: text().notNull(),
  product_name: text().notNull(),
  target: text().notNull(),
  core_message: text().notNull(),
  is_confirm: boolean().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});

// DROP TABLE IF EXISTS request_contents CASCADE;

// Use this migration files to get the context you need to generate a seed.sql file to seed each table in the database. For 'profile_id' column this value '1f75d123-89ab-4215-aab6-a48e1cf2f79a', respect composite primary keys, unique values so on. Create at least 5 rows per table if possible, 1 row per table that contains a composite primary key.

// Do not seed 'profile' use '1f75d123-89ab-4215-aab6-a48e1cf2f79a' for 'profile_id' everwhere
