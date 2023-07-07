-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'SUPERUSER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserPosition" AS ENUM ('DIREKSI', 'MANAJEMEN_REPRESENTATIVE', 'AUDITOR_INTERNAL', 'MANAJER_SERTIFIKASI', 'PENANGGUNG_JAWAB_TEKNIK', 'KOORDINATOR_PJT', 'TENAGA_TEKNIK', 'ADMINISTRATOR_UJI', 'STAFF_ADMINISTRASI', 'STAFF_KEUANGAN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(32),
    "password" TEXT,
    "name" TEXT,
    "position" "UserPosition",
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
