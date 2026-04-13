-- AlterTable: add gender column with default "boy"
ALTER TABLE "users" ADD COLUMN "gender" TEXT NOT NULL DEFAULT 'boy';
