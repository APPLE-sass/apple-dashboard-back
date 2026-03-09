// prisma/seed.ts
import { PrismaClient, Categoria } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed de catálogo...');

  // ─── Punto de Venta ───────────────────────────────────────────────────────
  const pdv = await prisma.puntoDeVenta.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      nombre: 'Local Centro',
      direccion: 'Bonifacio Córdoba 678',
      ciudad: 'San Fernando del Valle de Catamarca',
    },
  });

  console.log('✅ Punto de Venta:', pdv.nombre);

  // ─── Catálogo ─────────────────────────────────────────────────────────────
  const catalogoData = [
    { categoria: Categoria.iPhone,     modelo: 'iPhone 15 Pro',           memoria: '256GB', color: 'Titanio Negro',   precio: 1299.99 },
    { categoria: Categoria.iPhone,     modelo: 'iPhone 15 Pro',           memoria: '512GB', color: 'Titanio Natural', precio: 1499.99 },
    { categoria: Categoria.iPhone,     modelo: 'iPhone 14',               memoria: '128GB', color: 'Medianoche',      precio: 799.99  },
    { categoria: Categoria.Mac,        modelo: 'MacBook Pro 14"',         memoria: '512GB', color: 'Plata',           precio: 1999.99 },
    { categoria: Categoria.iPad,       modelo: 'iPad Pro 12.9"',          memoria: '256GB', color: 'Gris Espacial',   precio: 1099.99 },
    { categoria: Categoria.Watch,      modelo: 'Apple Watch Series 9',    memoria: '64GB',  color: 'Medianoche',      precio: 399.99  },
    { categoria: Categoria.AirPods,    modelo: 'AirPods Pro 2da Gen',     memoria: 'N/A',   color: 'Blanco',          precio: 249.99  },
    { categoria: Categoria.Accesorios, modelo: 'Funda MagSafe iPhone 15', memoria: 'N/A',   color: 'Rosa',            precio: 49.99   },
  ];

  for (const item of catalogoData) {
    await prisma.catalogoItem.create({
      data: { ...item, puntoDeVentaId: pdv.id },
    });
  }

  console.log(`✅ ${catalogoData.length} ítems de catálogo creados`);
  console.log('🎉 Seed completado');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });