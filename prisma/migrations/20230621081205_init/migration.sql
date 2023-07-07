/*
  Warnings:

  - You are about to drop the column `userId` on the `Document` table. All the data in the column will be lost.
  - The primary key for the `UserOnDocument` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `UserOnDocument` table. All the data in the column will be lost.
  - Added the required column `recipientId` to the `UserOnDocument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserOnDocument" DROP CONSTRAINT "UserOnDocument_userId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT;

-- AlterTable
ALTER TABLE "UserOnDocument" DROP CONSTRAINT "UserOnDocument_pkey",
DROP COLUMN "userId",
ADD COLUMN     "recipientId" TEXT NOT NULL,
ADD CONSTRAINT "UserOnDocument_pkey" PRIMARY KEY ("recipientId", "documentId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnDocument" ADD CONSTRAINT "UserOnDocument_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
