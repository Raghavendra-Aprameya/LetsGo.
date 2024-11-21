/*
  Warnings:

  - The `description` column on the `Trip` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "description",
ADD COLUMN     "description" JSONB;
