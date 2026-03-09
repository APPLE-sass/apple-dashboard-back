-- Migration manual: refactor_pdv_catalogo_unidades
-- Estrategia: renombrar tablas existentes y agregar columnas nuevas SIN borrar datos.

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. RENOMBRAR productos → unidades_fisicas
--    Conserva todos los datos existentes
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "productos" RENAME TO "unidades_fisicas";

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. RENOMBRAR historial_productos → historial_unidades
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "historial_productos" RENAME TO "historial_unidades";

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. ADAPTAR unidades_fisicas
--    - Agregar columnas nuevas que requiere el nuevo schema
--    - Renombrar columnas que cambiaron
--    - Eliminar columnas que ya no existen
-- ─────────────────────────────────────────────────────────────────────────────

-- Agregar imei (único por unidad física) — nullable primero para no romper filas existentes
ALTER TABLE "unidades_fisicas" ADD COLUMN IF NOT EXISTS "imei" TEXT;

-- Agregar estado de la unidad
DO $$ BEGIN
  CREATE TYPE "EstadoUnidad" AS ENUM ('DISPONIBLE', 'VENDIDA', 'RESERVADA', 'BAJA');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "unidades_fisicas" ADD COLUMN IF NOT EXISTS "estado" "EstadoUnidad" NOT NULL DEFAULT 'DISPONIBLE';

-- Agregar notas
ALTER TABLE "unidades_fisicas" ADD COLUMN IF NOT EXISTS "notas" TEXT;

-- Agregar catalogo_item_id (nullable primero, lo vincularemos después si hay datos)
ALTER TABLE "unidades_fisicas" ADD COLUMN IF NOT EXISTS "catalogo_item_id" TEXT;

-- Renombrar sucursal_id → punto_de_venta_id en unidades_fisicas
ALTER TABLE "unidades_fisicas" RENAME COLUMN "sucursal_id" TO "punto_de_venta_id";

-- Eliminar columnas que ya no existen en el nuevo schema
ALTER TABLE "unidades_fisicas" DROP COLUMN IF EXISTS "stock";

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. ADAPTAR historial_unidades
--    Renombrar producto_id → unidad_id
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "historial_unidades" RENAME COLUMN "producto_id" TO "unidad_id";

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. ADAPTAR movimientos_stock
--    Renombrar sucursal_id → punto_de_venta_id
--    Renombrar producto_id → unidad_id
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE "movimientos_stock" RENAME COLUMN "sucursal_id" TO "punto_de_venta_id";

-- producto_id puede o no existir según el estado actual de la tabla
ALTER TABLE "movimientos_stock" RENAME COLUMN "producto_id" TO "unidad_id";

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. CREAR tabla puntos_de_venta (si no existe ya por el db push anterior)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "puntos_de_venta" (
    "id"        TEXT         NOT NULL,
    "nombre"    TEXT         NOT NULL,
    "direccion" TEXT,
    "ciudad"    TEXT,
    "is_active" BOOLEAN      NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "puntos_de_venta_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. CREAR tabla catalogo_items (si no existe ya)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "catalogo_items" (
    "id"                 TEXT          NOT NULL,
    "categoria"          "Categoria"   NOT NULL,
    "modelo"             TEXT          NOT NULL,
    "memoria"            TEXT          NOT NULL,
    "color"              TEXT          NOT NULL,
    "precio"             DECIMAL(10,2) NOT NULL,
    "descripcion"        TEXT,
    "is_active"          BOOLEAN       NOT NULL DEFAULT true,
    "created_at"         TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"         TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "punto_de_venta_id"  TEXT          NOT NULL,
    CONSTRAINT "catalogo_items_pkey" PRIMARY KEY ("id")
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. INDEXES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS "unidades_fisicas_imei_idx"           ON "unidades_fisicas"("imei");
CREATE INDEX IF NOT EXISTS "unidades_fisicas_catalogo_item_id_idx" ON "unidades_fisicas"("catalogo_item_id");
CREATE INDEX IF NOT EXISTS "unidades_fisicas_punto_de_venta_id_idx" ON "unidades_fisicas"("punto_de_venta_id");
CREATE INDEX IF NOT EXISTS "unidades_fisicas_estado_idx"         ON "unidades_fisicas"("estado");
CREATE INDEX IF NOT EXISTS "unidades_fisicas_usado_idx"          ON "unidades_fisicas"("usado");

CREATE INDEX IF NOT EXISTS "historial_unidades_unidad_id_idx"    ON "historial_unidades"("unidad_id");

CREATE INDEX IF NOT EXISTS "catalogo_items_punto_de_venta_id_idx" ON "catalogo_items"("punto_de_venta_id");
CREATE INDEX IF NOT EXISTS "catalogo_items_categoria_idx"        ON "catalogo_items"("categoria");
CREATE INDEX IF NOT EXISTS "catalogo_items_modelo_idx"           ON "catalogo_items"("modelo");

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. FOREIGN KEYS
-- ─────────────────────────────────────────────────────────────────────────────

-- catalogo_items → puntos_de_venta
ALTER TABLE "catalogo_items"
    DROP CONSTRAINT IF EXISTS "catalogo_items_punto_de_venta_id_fkey";
ALTER TABLE "catalogo_items"
    ADD CONSTRAINT "catalogo_items_punto_de_venta_id_fkey"
    FOREIGN KEY ("punto_de_venta_id") REFERENCES "puntos_de_venta"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- unidades_fisicas → catalogo_items (solo si hay filas con catalogo_item_id)
ALTER TABLE "unidades_fisicas"
    DROP CONSTRAINT IF EXISTS "unidades_fisicas_catalogo_item_id_fkey";
ALTER TABLE "unidades_fisicas"
    ADD CONSTRAINT "unidades_fisicas_catalogo_item_id_fkey"
    FOREIGN KEY ("catalogo_item_id") REFERENCES "catalogo_items"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- unidades_fisicas → puntos_de_venta
ALTER TABLE "unidades_fisicas"
    DROP CONSTRAINT IF EXISTS "unidades_fisicas_punto_de_venta_id_fkey";
ALTER TABLE "unidades_fisicas"
    ADD CONSTRAINT "unidades_fisicas_punto_de_venta_id_fkey"
    FOREIGN KEY ("punto_de_venta_id") REFERENCES "puntos_de_venta"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- unidades_fisicas → proveedores
ALTER TABLE "unidades_fisicas"
    DROP CONSTRAINT IF EXISTS "unidades_fisicas_proveedor_id_fkey";
ALTER TABLE "unidades_fisicas"
    ADD CONSTRAINT "unidades_fisicas_proveedor_id_fkey"
    FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- historial_unidades → unidades_fisicas
ALTER TABLE "historial_unidades"
    DROP CONSTRAINT IF EXISTS "historial_productos_producto_id_fkey";
ALTER TABLE "historial_unidades"
    ADD CONSTRAINT "historial_unidades_unidad_id_fkey"
    FOREIGN KEY ("unidad_id") REFERENCES "unidades_fisicas"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- movimientos_stock → unidades_fisicas
ALTER TABLE "movimientos_stock"
    DROP CONSTRAINT IF EXISTS "movimientos_stock_producto_id_fkey";
ALTER TABLE "movimientos_stock"
    ADD CONSTRAINT "movimientos_stock_unidad_id_fkey"
    FOREIGN KEY ("unidad_id") REFERENCES "unidades_fisicas"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

-- movimientos_stock → puntos_de_venta
ALTER TABLE "movimientos_stock"
    DROP CONSTRAINT IF EXISTS "movimientos_stock_sucursal_id_fkey";
ALTER TABLE "movimientos_stock"
    ADD CONSTRAINT "movimientos_stock_punto_de_venta_id_fkey"
    FOREIGN KEY ("punto_de_venta_id") REFERENCES "puntos_de_venta"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;