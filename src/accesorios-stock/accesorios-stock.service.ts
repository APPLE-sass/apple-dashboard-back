import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccesorioDto } from './dto/create-accesorios.dto';
import { UpdateAccesorioDto } from './dto/update-accesorios.dto';

@Injectable()
export class AccesoriosStockService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAccesorioDto) {
    const catalogoItem = await this.prisma.catalogoItem.findUnique({ where: { id: dto.catalogoItemId } });
    if (!catalogoItem || catalogoItem.puntoDeVentaId !== dto.puntoDeVentaId) {
      throw new NotFoundException(`El ítem de catálogo "${dto.catalogoItemId}" no pertenece a este punto de venta`);
    }
    return this.prisma.accesorioStock.create({
      data: { sku: dto.sku, color: dto.color, descripcion: dto.descripcion, precio: dto.precio, cantidad: dto.cantidad, catalogoItemId: dto.catalogoItemId, puntoDeVentaId: dto.puntoDeVentaId },
      include: { catalogoItem: { include: { catalogoGlobal: true } }, puntoDeVenta: { select: { id: true, nombre: true } } },
    });
  }

  async findAll(filters: { puntoDeVentaId?: string; catalogoItemId?: string; page?: number; limit?: number }) {
    const { puntoDeVentaId, catalogoItemId, page = 1, limit = 20 } = filters;
    const where: Prisma.AccesorioStockWhereInput = {
      isActive: true,
      ...(puntoDeVentaId && { puntoDeVentaId }),
      ...(catalogoItemId && { catalogoItemId }),
    };
    const skip = (page - 1) * limit;
    const [total, items] = await this.prisma.$transaction([
      this.prisma.accesorioStock.count({ where }),
      this.prisma.accesorioStock.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { catalogoItem: { include: { catalogoGlobal: { select: { modelo: true, categoria: true } } } }, puntoDeVenta: { select: { id: true, nombre: true } } },
      }),
    ]);
    return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPrevPage: page > 1 } };
  }

  async findOne(id: string) {
    const a = await this.prisma.accesorioStock.findUnique({
      where: { id },
      include: { catalogoItem: { include: { catalogoGlobal: true } }, puntoDeVenta: true },
    });
    if (!a) throw new NotFoundException(`Accesorio "${id}" no encontrado`);
    return a;
  }

  async update(id: string, dto: UpdateAccesorioDto) {
    await this.findOne(id);
    return this.prisma.accesorioStock.update({
      where: { id },
      data: {
        ...(dto.sku !== undefined && { sku: dto.sku }),
        ...(dto.color !== undefined && { color: dto.color }),
        ...(dto.descripcion !== undefined && { descripcion: dto.descripcion }),
        ...(dto.precio !== undefined && { precio: dto.precio }),
        ...(dto.cantidad !== undefined && { cantidad: dto.cantidad }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
      include: { catalogoItem: { include: { catalogoGlobal: true } }, puntoDeVenta: { select: { id: true, nombre: true } } },
    });
  }

  async ajustarCantidad(id: string, delta: number) {
    const accesorio = await this.findOne(id);
    const nuevaCantidad = accesorio.cantidad + delta;
    if (nuevaCantidad < 0) throw new NotFoundException(`Stock insuficiente. Stock actual: ${accesorio.cantidad}`);
    return this.prisma.accesorioStock.update({ where: { id }, data: { cantidad: nuevaCantidad } });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.accesorioStock.update({ where: { id }, data: { isActive: false } });
    return { message: `Accesorio "${id}" eliminado correctamente` };
  }
}