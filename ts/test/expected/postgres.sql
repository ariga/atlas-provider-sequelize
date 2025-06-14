-- atlas:pos "public"."email"[type=table] test/load-models.test.ts:19-25
-- atlas:pos user[type=table] test/load-models.test.ts:27-47
-- atlas:pos post[type=table] test/load-models.test.ts:49-68

CREATE TABLE IF NOT EXISTS "public"."email" ("id"  SERIAL , "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
CREATE TYPE "enum_user_role" AS ENUM('admin', 'user', 'guest');
CREATE TABLE IF NOT EXISTS "user" ("id"  SERIAL , "name" VARCHAR(50) NOT NULL, "role" "public"."enum_user_role" DEFAULT 'user', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
CREATE INDEX "user_name_idx" ON "user" ("name");
CREATE TABLE IF NOT EXISTS "post" ("id"  SERIAL , "title" VARCHAR(255) NOT NULL, "userId" INTEGER REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE CASCADE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));
