-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey (recreated below with ON DELETE CASCADE)
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- User: add auth columns, backfilling existing rows.
-- Pre-existing users get an empty password hash: bcrypt comparison always
-- fails against it, so these accounts cannot log in until a password is set.
ALTER TABLE "User"
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "password" TEXT,
  ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER';

UPDATE "User" SET "password" = '' WHERE "password" IS NULL;
UPDATE "User" SET "name" = split_part("email", '@', 1) WHERE "name" IS NULL;

ALTER TABLE "User"
  ALTER COLUMN "password" SET NOT NULL,
  ALTER COLUMN "name" SET NOT NULL;

-- Post: add slug and timestamps, backfilling existing rows.
ALTER TABLE "Post"
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3),
  ADD COLUMN "slug" TEXT;

UPDATE "Post" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;
UPDATE "Post" SET "content" = '' WHERE "content" IS NULL;
UPDATE "Post"
  SET "slug" = trim(both '-' from regexp_replace(lower("title"), '[^a-z0-9]+', '-', 'g')) || '-' || "id"
  WHERE "slug" IS NULL;

ALTER TABLE "Post"
  ALTER COLUMN "updatedAt" SET NOT NULL,
  ALTER COLUMN "slug" SET NOT NULL,
  ALTER COLUMN "content" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");
CREATE INDEX "Post_published_createdAt_idx" ON "Post"("published", "createdAt");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
