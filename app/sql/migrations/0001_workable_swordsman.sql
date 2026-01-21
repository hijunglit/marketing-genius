CREATE TABLE "ai" (
	"ai_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ai_ai_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"profiles_id" uuid,
	"create_prompt" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request_contents" (
	"request_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "request_contents_request_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" uuid,
	"ai_id" bigint,
	"request_prompt" text NOT NULL,
	"is_confirm" boolean NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai" ADD CONSTRAINT "ai_profiles_id_profiles_profile_id_fk" FOREIGN KEY ("profiles_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_contents" ADD CONSTRAINT "request_contents_user_id_profiles_profile_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_contents" ADD CONSTRAINT "request_contents_ai_id_ai_ai_id_fk" FOREIGN KEY ("ai_id") REFERENCES "public"."ai"("ai_id") ON DELETE no action ON UPDATE no action;