import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AssignCatalogoDto } from './dto/assign-catalogo.dto';
import { UpdatePrecioLocalDto } from './dto/update-precio-local.dto';

@Injectable()
export class CatalogoPdvService {
  constructor(private readonly prisma: PrismaService) {}

  async assign(dto: AssignCatalogoDto) {
    const global = await this.prisma.catalogoGlobal.findUnique({ where: { id: dto.catalogoGlobalId } });
    if (!global) throw new NotFoundException(`Plantilla global "${dto.catalogoGlobalId}" no encontrada`);

    const pdv = await this.prisma.puntoDeVenta.findUnique({ where: { id: dto.puntoDeVentaId } });
    if (!pdv) throw new NotFoundException(`Punto de venta "${dto.puntoDeVentaId}" no encontrado`);

    const exists = await this.prisma.catalogoItem.findUnique({
      where: { catalogoGlobalId_puntoDeVentaId: { catalogoGlobalId: dto.catalogoGlobalId, puntoDeVentaId: dto.puntoDeVentaId } },
    });
    if (exists) throw new ConflictException(`La plantilla "${global.modelo}" ya está asignada al PdV "${pdv.nombre}"`);

    return this.prisma.catalogoItem.create({
      data: { catalogoGlobalId: dto.catalogoGlobalId, puntoDeVentaId: dto.puntoDeVentaId, precioLocal: dto.precioLocal ?? null },
      include: { catalogoGlobal: true, puntoDeVenta: { select: { id: true, nombre: true } } },
    });
  }

  async findByPdv(puntoDeVentaId: string) {
    const pdv = await this.prisma.puntoDeVenta.findUnique({ where: { id: puntoDeVentaId } });
    if (!pdv) throw new NotFoundException(`Punto de venta "${puntoDeVentaId}" no encontrado`);

    const items = await this.prisma.catalogoItem.findMany({
      where: { puntoDeVentaId, isActive: true },
      include: {
        catalogoGlobal: true,
        _count: {
          select: {
            dispositivos: { where: { estado: 'DISPONIBLE' } },
            accesorios: { where: { isActive: true } },
          },
        },
      },
      orderBy: { catalogoGlobal: { modelo: 'asc' } },
    });

    return {
      pdv: { id: pdv.id, nombre: pdv.nombre, ciudad: pdv.ciudad },
      items: items.map((item) => ({
        ...item,
        precioEfectivo: item.precioLocal ?? item.catalogoGlobal.precioSugerido,
      })),
    };
  }

  async findOneInPdv(puntoDeVentaId: string, catalogoItemId: string) {
    const item = await this.prisma.catalogoItem.findUnique({
      where: { id: catalogoItemId },
      include: {
        catalogoGlobal: true,
        puntoDeVenta: { select: { id: true, nombre: true } },
        dispositivos: {
          orderBy: { createdAt: 'desc' },
          include: { proveedor: { select: { id: true, nombre: true } } },
        },
        accesorios: { where: { isActive: true }, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!item || item.puntoDeVentaId !== puntoDeVentaId) {
      throw new NotFoundException(`Ítem de catálogo "${catalogoItemId}" no encontrado en este PdV`);
    }

    return { ...item, precioEfectivo: item.precioLocal ?? item.catalogoGlobal.precioSugerido };
  }

  async updatePrecioLocal(id: string, dto: UpdatePrecioLocalDto) {
    const item = await this.prisma.catalogoItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Ítem de catálogo "${id}" no encontrado`);
    return this.prisma.catalogoItem.update({
      where: { id },
      data: {
        ...(dto.precioLocal !== undefined && { precioLocal: dto.precioLocal }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      include: {
        catalogoGlobal: { select: { id: true, modelo: true, precioSugerido: true } },
        puntoDeVenta: { select: { id: true, nombre: true } },
      },
    });
  }

  async remove(id: string) {
    const item = await this.prisma.catalogoItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Ítem "${id}" no encontrado`);
    await this.prisma.catalogoItem.update({ where: { id }, data: { isActive: false } });
    return { message: `Ítem "${id}" desvinculado del punto de venta` };
  }
}