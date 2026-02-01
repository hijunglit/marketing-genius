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
  is_confirm: boolean().notNull().default(false),
  created_at: timestamp().notNull().defaultNow(),
});

// DROP TABLE IF EXISTS request_contents CASCADE;

// Use this migration files to get the context you need to generate a seed.sql file to seed each table in the database. For 'profile_id' column this value 'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f', respect composite primary keys, unique values so on. Create at least 5 rows per table if possible, 1 row per table that contains a composite primary key.

// Do not seed 'profile' use 'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f' for 'profile_id' everwhere

// 이 마이그레이션 파일을 사용하여 데이터베이스의 각 테이블을 시드하기 위해 seed.sql 파일을 생성하는 데 필요한 컨텍스트를 가져옵니다. 'profile_id' 열의 경우 이 값 'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f'는 복합 기본 키와 고유 값 등을 존중합니다. 가능하면 테이블당 최소 5개의 행, 복합 기본 키가 포함된 테이블당 1개의 행을 생성합니다.

// 'profiles'을 시드하지 마세요. 항상 'ad2b1d2d-0365-4a5a-a0ae-7be1757c347f'를 사용합니다.
