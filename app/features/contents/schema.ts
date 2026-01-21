import {
  bigint,
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";
import { ai } from "../ai/schema";

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

export const requestContents = pgTable("request_contents", {
  request_id: bigint({ mode: "number" })
    .primaryKey()
    .generatedAlwaysAsIdentity(),
  user_id: uuid().references(() => profiles.profile_id),
  ai_id: bigint({ mode: "number" }).references(() => ai.ai_id),
  request_prompt: text().notNull(),
  is_confirm: boolean().notNull(),
  created_at: timestamp().notNull().defaultNow(),
});
