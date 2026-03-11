/*
  Warnings:

  - You are about to drop the column `color` on the `catalogo_global` table. All the data in the column will be lost.
  - You are about to drop the column `memoria` on the `catalogo_global` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "catalogo_global" DROP COLUMN "color",
DROP COLUMN "memoria";

-- AlterTable
ALTER TABLE "dispositivos_stock" ADD COLUMN     "color" TEXT,
ADD COLUMN     "memoria" TEXT;
