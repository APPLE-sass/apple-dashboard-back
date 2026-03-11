-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VENDEDOR');

-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('iPhone', 'iPad', 'Mac', 'Watch', 'AirPods', 'Accesorios');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ENTRADA', 'SALIDA', 'AJUSTE', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "ImeiScanStatus" AS ENUM ('SUCCESS', 'INVALID_IMEI');

-- CreateEnum
CREATE TYPE "EstadoDispositivo" AS ENUM ('DISPONIBLE', 'VENDIDO', 'RESERVADO', 'BAJA');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VENDEDOR',
    "refresh_token" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "puntos_de_venta" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "ciudad" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "puntos_de_venta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogo_global" (
    "id" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "modelo" TEXT NOT NULL,
    "memoria" TEXT,
    "color" TEXT,
    "descripcion" TEXT,
    "precio_sugerido" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalogo_global_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogo_items" (
    "id" TEXT NOT NULL,
    "precio_local" DECIMAL(10,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "catalogo_global_id" TEXT NOT NULL,
    "punto_de_venta_id" TEXT NOT NULL,

    CONSTRAINT "catalogo_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispositivos_stock" (
    "id" TEXT NOT NULL,
    "imei" TEXT NOT NULL,
    "bateria" INTEGER,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "estado" "EstadoDispositivo" NOT NULL DEFAULT 'DISPONIBLE',
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "catalogo_item_id" TEXT NOT NULL,
    "punto_de_venta_id" TEXT NOT NULL,
    "proveedor_id" TEXT,

    CONSTRAINT "dispositivos_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accesorios_stock" (
    "id" TEXT NOT NULL,
    "sku" TEXT,
    "color" TEXT,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "catalogo_item_id" TEXT NOT NULL,
    "punto_de_venta_id" TEXT NOT NULL,

    CONSTRAINT "accesorios_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_dispositivos" (
    "id" TEXT NOT NULL,
    "dispositivo_id" TEXT NOT NULL,
    "campo" TEXT NOT NULL,
    "valor_antes" TEXT,
    "valor_despues" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_dispositivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT,
    "email" TEXT,
    "telefono" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imei_scan_logs" (
    "id" TEXT NOT NULL,
    "imei" TEXT NOT NULL,
    "status" "ImeiScanStatus" NOT NULL DEFAULT 'SUCCESS',
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imei_scan_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "catalogo_global_categoria_idx" ON "catalogo_global"("categoria");

-- CreateIndex
CREATE INDEX "catalogo_global_modelo_idx" ON "catalogo_global"("modelo");

-- CreateIndex
CREATE INDEX "catalogo_items_catalogo_global_id_idx" ON "catalogo_items"("catalogo_global_id");

-- CreateIndex
CREATE INDEX "catalogo_items_punto_de_venta_id_idx" ON "catalogo_items"("punto_de_venta_id");

-- CreateIndex
CREATE UNIQUE INDEX "catalogo_items_catalogo_global_id_punto_de_venta_id_key" ON "catalogo_items"("catalogo_global_id", "punto_de_venta_id");

-- CreateIndex
CREATE UNIQUE INDEX "dispositivos_stock_imei_key" ON "dispositivos_stock"("imei");

-- CreateIndex
CREATE INDEX "dispositivos_stock_imei_idx" ON "dispositivos_stock"("imei");

-- CreateIndex
CREATE INDEX "dispositivos_stock_catalogo_item_id_idx" ON "dispositivos_stock"("catalogo_item_id");

-- CreateIndex
CREATE INDEX "dispositivos_stock_punto_de_venta_id_idx" ON "dispositivos_stock"("punto_de_venta_id");

-- CreateIndex
CREATE INDEX "dispositivos_stock_estado_idx" ON "dispositivos_stock"("estado");

-- CreateIndex
CREATE INDEX "dispositivos_stock_usado_idx" ON "dispositivos_stock"("usado");

-- CreateIndex
CREATE INDEX "accesorios_stock_catalogo_item_id_idx" ON "accesorios_stock"("catalogo_item_id");

-- CreateIndex
CREATE INDEX "accesorios_stock_punto_de_venta_id_idx" ON "accesorios_stock"("punto_de_venta_id");

-- CreateIndex
CREATE INDEX "accesorios_stock_sku_idx" ON "accesorios_stock"("sku");

-- CreateIndex
CREATE INDEX "historial_dispositivos_dispositivo_id_idx" ON "historial_dispositivos"("dispositivo_id");

-- CreateIndex
CREATE UNIQUE INDEX "proveedores_email_key" ON "proveedores"("email");

-- CreateIndex
CREATE INDEX "imei_scan_logs_imei_idx" ON "imei_scan_logs"("imei");

-- CreateIndex
CREATE INDEX "imei_scan_logs_user_id_idx" ON "imei_scan_logs"("user_id");

-- CreateIndex
CREATE INDEX "imei_scan_logs_status_idx" ON "imei_scan_logs"("status");

-- CreateIndex
CREATE INDEX "imei_scan_logs_created_at_idx" ON "imei_scan_logs"("created_at");

-- AddForeignKey
ALTER TABLE "catalogo_items" ADD CONSTRAINT "catalogo_items_catalogo_global_id_fkey" FOREIGN KEY ("catalogo_global_id") REFERENCES "catalogo_global"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalogo_items" ADD CONSTRAINT "catalogo_items_punto_de_venta_id_fkey" FOREIGN KEY ("punto_de_venta_id") REFERENCES "puntos_de_venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispositivos_stock" ADD CONSTRAINT "dispositivos_stock_catalogo_item_id_fkey" FOREIGN KEY ("catalogo_item_id") REFERENCES "catalogo_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispositivos_stock" ADD CONSTRAINT "dispositivos_stock_punto_de_venta_id_fkey" FOREIGN KEY ("punto_de_venta_id") REFERENCES "puntos_de_venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispositivos_stock" ADD CONSTRAINT "dispositivos_stock_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesorios_stock" ADD CONSTRAINT "accesorios_stock_catalogo_item_id_fkey" FOREIGN KEY ("catalogo_item_id") REFERENCES "catalogo_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesorios_stock" ADD CONSTRAINT "accesorios_stock_punto_de_venta_id_fkey" FOREIGN KEY ("punto_de_venta_id") REFERENCES "puntos_de_venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_dispositivos" ADD CONSTRAINT "historial_dispositivos_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos_stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imei_scan_logs" ADD CONSTRAINT "imei_scan_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
