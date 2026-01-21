import { pgSchema, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const users = pgSchema("auth").table("users", {
  id: uuid().primaryKey(),
});

export const profiles = pgTable("profiles", {
  profile_id: uuid()
    .primaryKey()
    .references(() => users.id),
  name: text().notNull(),
  username: text().notNull(),
  avatar_url: text().notNull().default("https://github.com/annonymous"),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});
