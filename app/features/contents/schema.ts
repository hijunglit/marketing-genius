import { bigint, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const contents = pgTable("contents", {
  contents_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  profile_id: uuid().references(() => profiles.profile_id),
  request_prompt: text().notNull(),
  text: text().notNull(),
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
