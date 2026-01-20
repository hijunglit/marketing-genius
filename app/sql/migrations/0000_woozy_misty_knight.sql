CREATE TABLE "contents" (
	"user_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contents_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nme" text NOT NULL,
	"username" text NOT NULL,
	"avatar_url" text DEFAULT 'https://github.com/elon-musk.png' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
