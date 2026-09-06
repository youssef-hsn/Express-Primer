CREATE TYPE "public"."example_status" AS ENUM('active', 'archived');--> statement-breakpoint
CREATE TABLE "example" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"status" "example_status" DEFAULT 'active' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "example_name_live_idx" ON "example" USING btree ("name") WHERE "example"."deleted_at" is null;