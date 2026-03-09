// src/catalogo/catalogo.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatalogoItemDto } from './dto/create-catalogo-item.dto';
import { UpdateCatalogoItemDto } from './dto/update-catalogo-item.dto';
import { FilterCatalogoDto } from './dto/filter-catalogo.dto';

@Injectable()
export class CatalogoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCatalogoItemDto) {
    const pdv = await this.prisma.puntoDeVenta.findUnique({
      where: { id: dto.puntoDeVentaId },
    });
    if (!pdv) throw new NotFoundException(`Punto de venta "${dto.puntoDeVentaId}" no encontrado`);

    return this.prisma.catalogoItem.create({
      data: {
        modelo:         dto.modelo,
        categoria:      dto.categoria,
        memoria:        dto.memoria,
        color:          dto.color,
        precio:         dto.precio,        // ← era precioBase
        descripcion:    dto.descripcion,
        puntoDeVentaId: dto.puntoDeVentaId,
        // stock no existe en CatalogoItem — se calcula contando unidades físicas
      },
      include: { puntoDeVenta: { select: { id: true, nombre: true } } },
    });
  }

  // Listar todo el catálogo (todos los PdV) con filtros
  async findAll(filters: FilterCatalogoDto) {
    const { categoria, modelo, memoria, color, page = 1, limit = 20 } = filters;

    const where: Prisma.CatalogoItemWhereInput = {
      isActive: true,
      ...(categoria && { categoria }),
      ...(modelo && { modelo: { contains: modelo, mode: Prisma.QueryMode.insensitive } }),
      ...(memoria && { memoria }),
      ...(color && { color: { contains: color, mode: Prisma.QueryMode.insensitive } }),
    };

    const skip = (page - 1) * limit;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.catalogoItem.count({ where }),
      this.prisma.catalogoItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ categoria: 'asc' }, { modelo: 'asc' }],
        include: {
          puntoDeVenta: { select: { id: true, nombre: true } },
          _count: { select: { unidades: true } },  // ← era "productos"
        },
      }),
    ]);

    return {
      items,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  // Listar catálogo de un PdV específico con filtros
  async findByPdv(puntoDeVentaId: string, filters: FilterCatalogoDto) {
    const pdv = await this.prisma.puntoDeVenta.findUnique({ where: { id: puntoDeVentaId } });
    if (!pdv) throw new NotFoundException(`Punto de venta "${puntoDeVentaId}" no encontrado`);

    const { categoria, modelo, memoria, color, page = 1, limit = 20 } = filters;

    const where: Prisma.CatalogoItemWhereInput = {
      puntoDeVentaId,
      isActive: true,
      ...(categoria && { categoria }),
      ...(modelo && { modelo: { contains: modelo, mode: Prisma.QueryMode.insensitive } }),
      ...(memoria && { memoria }),
      ...(color && { color: { contains: color, mode: Prisma.QueryMode.insensitive } }),
    };

    const skip = (page - 1) * limit;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.catalogoItem.count({ where }),
      this.prisma.catalogoItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ categoria: 'asc' }, { modelo: 'asc' }],
        include: {
          _count: { select: { unidades: true } },  // ← era "productos"
        },
      }),
    ]);

    return {
      pdv: { id: pdv.id, nombre: pdv.nombre },
      items,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.catalogoItem.findUnique({
      where: { id },
      include: {
        puntoDeVenta: { select: { id: true, nombre: true } },
        _count: { select: { unidades: true } },  // ← era "productos"
      },
    });
    if (!item) throw new NotFoundException(`Ítem de catálogo "${id}" no encontrado`);
    return item;
  }

  async update(id: string, dto: UpdateCatalogoItemDto) {
    await this.findOne(id);
    return this.prisma.catalogoItem.update({
      where: { id },
      data: {
        ...(dto.modelo      !== undefined && { modelo:      dto.modelo }),
        ...(dto.categoria   !== undefined && { categoria:   dto.categoria }),
        ...(dto.memoria     !== undefined && { memoria:     dto.memoria }),
        ...(dto.color       !== undefined && { color:       dto.color }),
        ...(dto.precio      !== undefined && { precio:      dto.precio }),  // ← era precioBase
        ...(dto.descripcion !== undefined && { descripcion: dto.descripcion }),
        ...(dto.isActive    !== undefined && { isActive:    dto.isActive }),
      },
      include: { puntoDeVenta: { select: { id: true, nombre: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.catalogoItem.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: `Ítem de catálogo "${id}" eliminado del catálogo` };
  }
}