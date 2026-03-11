import { PrismaClient, Categoria, Role, EstadoDispositivo } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed...');

  // ─── Usuario Admin ────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Admin1234!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'marcos@todoapple.com' },
    update: {},
    create: {
      email: 'marcos@todoapple.com',
      nombre: 'Marcos',
      passwordHash,
      role: Role.ADMIN,
    },
  });
  console.log('✅ Usuario admin:', admin.email);

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
  console.log('✅ PdV:', pdv.nombre);

  // ─── Catálogo Global ──────────────────────────────────────────────────────
  const globalItemsData = [
    { categoria: Categoria.iPhone,     modelo: 'iPhone 15 Pro',           precioSugerido: 1299.99 },
    { categoria: Categoria.iPhone,     modelo: 'iPhone 15',               precioSugerido: 999.99  },
    { categoria: Categoria.iPhone,     modelo: 'iPhone 14',               precioSugerido: 799.99  },
    { categoria: Categoria.Mac,        modelo: 'MacBook Pro 14"',         precioSugerido: 1999.99 },
    { categoria: Categoria.iPad,       modelo: 'iPad Pro 12.9"',          precioSugerido: 1099.99 },
    { categoria: Categoria.Watch,      modelo: 'Apple Watch Series 9',    precioSugerido: 399.99  },
    { categoria: Categoria.AirPods,    modelo: 'AirPods Pro 2da Gen',     descripcion: 'Con cancelación activa de ruido', precioSugerido: 249.99 },
    { categoria: Categoria.Accesorios, modelo: 'Funda MagSafe iPhone 15', descripcion: 'Funda de silicona con MagSafe', precioSugerido: 49.99 },
    { categoria: Categoria.Accesorios, modelo: 'Templado iPhone 15',      descripcion: 'Vidrio templado 9H',            precioSugerido: 19.99 },
    { categoria: Categoria.Accesorios, modelo: 'Cable USB-C 2m',          descripcion: 'Cable trenzado USB-C a USB-C',  precioSugerido: 29.99 },
  ];

  // Crear globales y sus reflejos en el PdV, guardando los CatalogoItem ids
  const catalogoItemIds: Record<string, string> = {};

  for (const item of globalItemsData) {
    const global = await prisma.catalogoGlobal.create({ data: item });
    const catalogoItem = await prisma.catalogoItem.create({
      data: { catalogoGlobalId: global.id, puntoDeVentaId: pdv.id },
    });
    catalogoItemIds[item.modelo] = catalogoItem.id;
    console.log(`  ✅ Global + reflejo: ${item.modelo}`);
  }

  // ─── Dispositivos de ejemplo ──────────────────────────────────────────────
  console.log('\n📱 Cargando dispositivos...');

  const dispositivos = [
    // iPhone 15 Pro — varios colores y memorias
    { modelo: 'iPhone 15 Pro', imei: '354678901234563', memoria: '256GB', color: 'Titanio Negro',   bateria: 100, usado: false, estado: EstadoDispositivo.DISPONIBLE },
    { modelo: 'iPhone 15 Pro', imei: '354678901234571', memoria: '256GB', color: 'Titanio Blanco',  bateria: 100, usado: false, estado: EstadoDispositivo.DISPONIBLE },
    { modelo: 'iPhone 15 Pro', imei: '354678901234589', memoria: '512GB', color: 'Titanio Natural', bateria: 100, usado: false, estado: EstadoDispositivo.DISPONIBLE },
    { modelo: 'iPhone 15 Pro', imei: '354678901234597', memoria: '512GB', color: 'Titanio Azul',    bateria: 87,  usado: true,  estado: EstadoDispositivo.DISPONIBLE, notas: 'Caja abierta, sin uso real' },
    // iPhone 15
    { modelo: 'iPhone 15',     imei: '354678901234605', memoria: '128GB', color: 'Rosa',            bateria: 100, usado: false, estado: EstadoDispositivo.DISPONIBLE },
    { modelo: 'iPhone 15',     imei: '354678901234613', memoria: '128GB', color: 'Amarillo',        bateria: 100, usado: false, estado: EstadoDispositivo.DISPONIBLE },
    { modelo: 'iPhone 15',     imei: '354678901234621', memoria: '256GB', color: 'Negro',           bateria: 92,  usado: true,  estado: EstadoDispositivo.DISPONIBLE, notas: 'Usado 3 meses, impecable' },
    // iPhone 14
    { modelo: 'iPhone 14',     imei: '354678901234639', memoria: '128GB', color: 'Medianoche',      bateria: 89,  usado: true,  estado: EstadoDispositivo.DISPONIBLE },
    { modelo: 'iPhone 14',     imei: '354678901234647', memoria: '256GB', color: 'Blanco Estelar',  bateria: 95,  usado: true,  estado: EstadoDispositivo.RESERVADO,  notas: 'Reservado para cliente' },
    // MacBook Pro
    { modelo: 'MacBook Pro 14"', imei: '354678901234654', memoria: '512GB', color: 'Plata',         bateria: 100, usado: false, estado: EstadoDispositivo.DISPONIBLE },
    // iPad Pro
    { modelo: 'iPad Pro 12.9"',  imei: '354678901234662', memoria: '256GB', color: 'Gris Espacial', bateria: 100, usado: false, estado: EstadoDispositivo.DISPONIBLE },
    // Apple Watch
    { modelo: 'Apple Watch Series 9', imei: '354678901234670', memoria: '32GB', color: 'Medianoche', bateria: 100, usado: false, estado: EstadoDispositivo.DISPONIBLE },
    { modelo: 'Apple Watch Series 9', imei: '354678901234688', memoria: '32GB', color: 'Starlight',  bateria: 78,  usado: true,  estado: EstadoDispositivo.DISPONIBLE, notas: 'Con malla original' },
  ];

  for (const d of dispositivos) {
    const catalogoItemId = catalogoItemIds[d.modelo];
    await prisma.dispositivoStock.create({
      data: {
        imei:           d.imei,
        memoria:        d.memoria,
        color:          d.color,
        bateria:        d.bateria,
        usado:          d.usado,
        estado:         d.estado,
        notas:          d.notas ?? null,
        catalogoItemId,
        puntoDeVentaId: pdv.id,
      },
    });
    console.log(`  ✅ ${d.modelo} ${d.memoria} ${d.color} — IMEI ${d.imei}`);
  }

  // ─── Accesorios de ejemplo ────────────────────────────────────────────────
  console.log('\n🎒 Cargando accesorios...');

  const accesorios = [
    // Fundas MagSafe
    { modelo: 'Funda MagSafe iPhone 15', sku: 'FMS15-ROS', color: 'Rosa',    descripcion: 'Funda silicona MagSafe Rosa',    precio: 49.99, cantidad: 8  },
    { modelo: 'Funda MagSafe iPhone 15', sku: 'FMS15-NEG', color: 'Negro',   descripcion: 'Funda silicona MagSafe Negro',   precio: 49.99, cantidad: 5  },
    { modelo: 'Funda MagSafe iPhone 15', sku: 'FMS15-AZU', color: 'Azul',    descripcion: 'Funda silicona MagSafe Azul',    precio: 49.99, cantidad: 3  },
    // Templados
    { modelo: 'Templado iPhone 15',      sku: 'TPL15-STD', color: null,      descripcion: 'Vidrio templado 9H iPhone 15',   precio: 19.99, cantidad: 20 },
    // AirPods
    { modelo: 'AirPods Pro 2da Gen',     sku: 'APP2-BOX',  color: 'Blanco',  descripcion: 'AirPods Pro 2da gen sellados',   precio: 249.99, cantidad: 4 },
    // Cables
    { modelo: 'Cable USB-C 2m',          sku: 'CBL-UC2M',  color: 'Blanco',  descripcion: 'Cable trenzado USB-C 2 metros',  precio: 29.99, cantidad: 15 },
    { modelo: 'Cable USB-C 2m',          sku: 'CBL-UC2M-N', color: 'Negro',  descripcion: 'Cable trenzado USB-C 2 metros',  precio: 29.99, cantidad: 10 },
  ];

  for (const a of accesorios) {
    const catalogoItemId = catalogoItemIds[a.modelo];
    await prisma.accesorioStock.create({
      data: {
        sku:            a.sku,
        color:          a.color,
        descripcion:    a.descripcion,
        precio:         a.precio,
        cantidad:       a.cantidad,
        catalogoItemId,
        puntoDeVentaId: pdv.id,
      },
    });
    console.log(`  ✅ ${a.modelo} ${a.color ?? ''} — stock: ${a.cantidad}`);
  }

  console.log('\n🎉 Seed completado');
  console.log('─────────────────────────────────────');
  console.log(`👤 Admin: marcos@todoapple.com / Admin1234!`);
  console.log(`🏪 PdV:   Local Centro — Catamarca`);
  console.log(`📱 Dispositivos: ${dispositivos.length}`);
  console.log(`🎒 Accesorios:   ${accesorios.length} líneas de stock`);
}

main()
  .catch((e) => { console.error('❌', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });