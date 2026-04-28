CREATE TABLE "listing_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seller_id" uuid NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(255) NOT NULL,
	"company" varchar(100) NOT NULL,
	"model" varchar(100) NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"mileage" integer NOT NULL,
	"fuel_type" "fuel_type" DEFAULT 'petrol' NOT NULL,
	"transmission" "transmission" DEFAULT 'automatic' NOT NULL,
	"color" varchar(30) NOT NULL,
	"images" text[] NOT NULL,
	"status" "listing_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listing_table" ADD CONSTRAINT "listing_table_seller_id_users_user_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;