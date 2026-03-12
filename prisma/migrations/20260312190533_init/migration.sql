-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VENDEDOR');

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
CREATE TABLE "accesorios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "punto_de_venta_id" TEXT NOT NULL,

    CONSTRAINT "accesorios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accesorio_colores" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "accesorio_id" TEXT NOT NULL,

    CONSTRAINT "accesorio_colores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accesorio_imagenes" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accesorio_id" TEXT NOT NULL,

    CONSTRAINT "accesorio_imagenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_accesorios" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "punto_de_venta_id" TEXT NOT NULL,

    CONSTRAINT "sub_accesorios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_accesorio_colores" (
    "id" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "sub_accesorio_id" TEXT NOT NULL,

    CONSTRAINT "sub_accesorio_colores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_accesorio_imagenes" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sub_accesorio_id" TEXT NOT NULL,

    CONSTRAINT "sub_accesorio_imagenes_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "accesorios_punto_de_venta_id_idx" ON "accesorios"("punto_de_venta_id");

-- CreateIndex
CREATE INDEX "accesorios_nombre_idx" ON "accesorios"("nombre");

-- CreateIndex
CREATE INDEX "accesorios_tipo_idx" ON "accesorios"("tipo");

-- CreateIndex
CREATE INDEX "accesorio_colores_accesorio_id_idx" ON "accesorio_colores"("accesorio_id");

-- CreateIndex
CREATE INDEX "accesorio_imagenes_accesorio_id_idx" ON "accesorio_imagenes"("accesorio_id");

-- CreateIndex
CREATE INDEX "sub_accesorios_punto_de_venta_id_idx" ON "sub_accesorios"("punto_de_venta_id");

-- CreateIndex
CREATE INDEX "sub_accesorios_nombre_idx" ON "sub_accesorios"("nombre");

-- CreateIndex
CREATE INDEX "sub_accesorios_tipo_idx" ON "sub_accesorios"("tipo");

-- CreateIndex
CREATE INDEX "sub_accesorio_colores_sub_accesorio_id_idx" ON "sub_accesorio_colores"("sub_accesorio_id");

-- CreateIndex
CREATE INDEX "sub_accesorio_imagenes_sub_accesorio_id_idx" ON "sub_accesorio_imagenes"("sub_accesorio_id");

-- AddForeignKey
ALTER TABLE "accesorios" ADD CONSTRAINT "accesorios_punto_de_venta_id_fkey" FOREIGN KEY ("punto_de_venta_id") REFERENCES "puntos_de_venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesorio_colores" ADD CONSTRAINT "accesorio_colores_accesorio_id_fkey" FOREIGN KEY ("accesorio_id") REFERENCES "accesorios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accesorio_imagenes" ADD CONSTRAINT "accesorio_imagenes_accesorio_id_fkey" FOREIGN KEY ("accesorio_id") REFERENCES "accesorios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_accesorios" ADD CONSTRAINT "sub_accesorios_punto_de_venta_id_fkey" FOREIGN KEY ("punto_de_venta_id") REFERENCES "puntos_de_venta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_accesorio_colores" ADD CONSTRAINT "sub_accesorio_colores_sub_accesorio_id_fkey" FOREIGN KEY ("sub_accesorio_id") REFERENCES "sub_accesorios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_accesorio_imagenes" ADD CONSTRAINT "sub_accesorio_imagenes_sub_accesorio_id_fkey" FOREIGN KEY ("sub_accesorio_id") REFERENCES "sub_accesorios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
