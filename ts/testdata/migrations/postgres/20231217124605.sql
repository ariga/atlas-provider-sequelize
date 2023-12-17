-- Create "contact" table
CREATE TABLE "public"."contact" (
  "id" serial NOT NULL,
  "name" character varying(45) NOT NULL,
  "alias" character varying(45) NOT NULL,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  PRIMARY KEY ("id")
);
-- Create index "name-alias" to table: "contact"
CREATE UNIQUE INDEX "name-alias" ON "public"."contact" ("name", "alias");
-- Create "email" table
CREATE TABLE "public"."email" (
  "id" serial NOT NULL,
  "email" character varying(60) NOT NULL,
  "contact_id" integer NOT NULL,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "email_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "public"."contact" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);
-- Create "phone" table
CREATE TABLE "public"."phone" (
  "id" serial NOT NULL,
  "phone" character varying(20) NOT NULL,
  "contact_id" integer NOT NULL,
  "created_at" timestamptz NOT NULL,
  "updated_at" timestamptz NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "phone_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "public"."contact" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);
