// src/punto-de-venta/punto-de-venta.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePdvDto } from './dto/create-pdv.dto';
import { UpdatePdvDto } from './dto/update-pdv';

@Injectable()
export class PuntoDeVentaService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  async create(dto: CreatePdvDto) {
    return this.prisma.puntoDeVenta.create({ data: dto });
  }

  async findAll() {
    return this.prisma.puntoDeVenta.findMany({
      where: { isActive: true },
      orderBy: { nombre: 'asc' },
      include: {
        _count: {
          select: {
            catalogoItems: { where: { isActive: true } },
            unidades: true,   // ← era "productos"
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const pdv = await this.prisma.puntoDeVenta.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            catalogoItems: { where: { isActive: true } },
            unidades: true,   // ← era "productos"
          },
        },
      },
    });
    if (!pdv) throw new NotFoundException(`Punto de venta "${id}" no encontrado`);
    return pdv;
  }

  async update(id: string, dto: UpdatePdvDto) {
    await this.findOne(id);
    return this.prisma.puntoDeVenta.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.puntoDeVenta.update({
      where: { id },
      data: { isActive: false },
    });
    return { message: `Punto de venta "${id}" desactivado correctamente` };
  }

  // ─── Unidades físicas del PdV ──────────────────────────────────────────────

  async findUnidades(
    id: string,
    filters: { categoria?: string; usado?: boolean; estado?: string; page?: number; limit?: number },
  ) {
    await this.findOne(id);

    const { categoria, usado, estado, page = 1, limit = 20 } = filters;

    const where: Prisma.UnidadFisicaWhereInput = {
      puntoDeVentaId: id,
      ...(usado !== undefined && { usado }),
      ...(estado && { estado: estado as any }),
      ...(categoria && {
        catalogoItem: { categoria: categoria as any },
      }),
    };

    const skip = (page - 1) * limit;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.unidadFisica.count({ where }),
      this.prisma.unidadFisica.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          catalogoItem: {
            select: { id: true, modelo: true, categoria: true, precio: true, memoria: true, color: true },
          },
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
}