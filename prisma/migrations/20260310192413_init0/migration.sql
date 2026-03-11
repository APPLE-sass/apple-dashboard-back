/*
  Warnings:

  - You are about to drop the column `categoria` on the `unidades_fisicas` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `unidades_fisicas` table. All the data in the column will be lost.
  - You are about to drop the column `memoria` on the `unidades_fisicas` table. All the data in the column will be lost.
  - You are about to drop the column `modelo` on the `unidades_fisicas` table. All the data in the column will be lost.
  - You are about to drop the column `precio` on the `unidades_fisicas` table. All the data in the column will be lost.
  - You are about to drop the `sucursales` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[imei]` on the table `unidades_fisicas` will be added. If there are existing duplicate values, this will fail.
  - Made the column `punto_de_venta_id` on table `unidades_fisicas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imei` on table `unidades_fisicas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `catalogo_item_id` on table `unidades_fisicas` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "movimientos_stock" DROP CONSTRAINT "movimientos_stock_unidad_id_fkey";

-- DropForeignKey
ALTER TABLE "unidades_fisicas" DROP CONSTRAINT "productos_sucursal_id_fkey";

-- DropForeignKey
ALTER TABLE "unidades_fisicas" DROP CONSTRAINT "unidades_fisicas_punto_de_venta_id_fkey";

-- DropIndex
DROP INDEX "productos_categoria_idx";

-- DropIndex
DROP INDEX "productos_color_idx";

-- DropIndex
DROP INDEX "productos_memoria_idx";

-- DropIndex
DROP INDEX "productos_modelo_idx";

-- DropIndex
DROP INDEX "productos_precio_idx";

-- DropIndex
DROP INDEX "productos_proveedor_id_idx";

-- AlterTable
ALTER TABLE "catalogo_items" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "historial_unidades" RENAME CONSTRAINT "historial_productos_pkey" TO "historial_unidades_pkey";

-- AlterTable
ALTER TABLE "movimientos_stock" ALTER COLUMN "unidad_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "puntos_de_venta" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "unidades_fisicas" RENAME CONSTRAINT "productos_pkey" TO "unidades_fisicas_pkey",
DROP COLUMN "categoria",
DROP COLUMN "color",
DROP COLUMN "memoria",
DROP COLUMN "modelo",
DROP COLUMN "precio",
ALTER COLUMN "punto_de_venta_id" SET NOT NULL,
ALTER COLUMN "imei" SET NOT NULL,
ALTER COLUMN "catalogo_item_id" SET NOT NULL;

-- DropTable
DROP TABLE "sucursales";

-- CreateIndex
CREATE UNIQUE INDEX "unidades_fisicas_imei_key" ON "unidades_fisicas"("imei");

-- RenameForeignKey
ALTER TABLE "unidades_fisicas" RENAME CONSTRAINT "productos_proveedor_id_fkey" TO "unidades_fisicas_proveedor_id_fkey";

-- AddForeignKey
ALTER TABLE "unidades_fisicas" ADD CONSTRAINT "unidades_fisicas_punto_de_venta_id_fkey" FOREIGN KEY ("punto_de_venta_id") REFERENCES "puntos_de_venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_stock" ADD CONSTRAINT "movimientos_stock_unidad_id_fkey" FOREIGN KEY ("unidad_id") REFERENCES "unidades_fisicas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "movimientos_stock_producto_id_idx" RENAME TO "movimientos_stock_unidad_id_idx";
