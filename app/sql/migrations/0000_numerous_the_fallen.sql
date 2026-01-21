CREATE TABLE "contents" (
	"contents_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "contents_contents_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profile_id" uuid,
	"request_prompt" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"image_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "images_image_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"image_url" text NOT NULL,
	"contents_id" bigint
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"avatar_url" text DEFAULT 'https://github.com/annonymous' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contents" ADD CONSTRAINT "contents_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_contents_id_contents_contents_id_fk" FOREIGN KEY ("contents_id") REFERENCES "public"."contents"("contents_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;