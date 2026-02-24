ALTER TABLE "request_contents" DROP CONSTRAINT "request_contents_contents_id_contents_contents_id_fk";
--> statement-breakpoint
ALTER TABLE "images" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "request_contents" ADD CONSTRAINT "request_contents_contents_id_contents_contents_id_fk" FOREIGN KEY ("contents_id") REFERENCES "public"."contents"("contents_id") ON DELETE set null ON UPDATE no action;