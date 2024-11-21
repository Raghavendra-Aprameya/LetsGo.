/*
  Warnings:

  - You are about to drop the column `amountPaid` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "amountPaid",
DROP COLUMN "notes",
DROP COLUMN "paymentMethod",
DROP COLUMN "paymentStatus",
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "paymentId" TEXT NOT NULL,
ADD COLUMN     "totalAmount" INTEGER NOT NULL;
