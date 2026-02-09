ALTER TABLE "ai" RENAME COLUMN "profiles_id" TO "profile_id";--> statement-breakpoint
ALTER TABLE "ai" DROP CONSTRAINT "ai_profiles_id_profiles_profile_id_fk";
--> statement-breakpoint
ALTER TABLE "ai" ADD CONSTRAINT "ai_profile_id_profiles_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;