ALTER TABLE "ai" RENAME COLUMN "create_prompt" TO "company_description";--> statement-breakpoint
ALTER TABLE "ai" ADD COLUMN "company_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ai" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ai" ADD COLUMN "core_service" text NOT NULL;