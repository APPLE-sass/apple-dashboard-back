import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatalogoGlobalDto } from './dto/create-catalogo-global.dto';
import { UpdateCatalogoGlobalDto } from './dto/update-catalogo-global.dto';
import { FilterCatalogoGlobalDto } from './dto/filter-catalogo-global.dto';

@Injectable()
export class CatalogoGlobalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCatalogoGlobalDto) {
    return this.prisma.catalogoGlobal.create({ data: dto });
  }

  async findAll(filters: FilterCatalogoGlobalDto) {
    const { categoria, modelo, page = 1, limit = 20 } = filters;
    const where: Prisma.CatalogoGlobalWhereInput = {
      isActive: true,
      ...(categoria && { categoria }),
      ...(modelo && { modelo: { contains: modelo, mode: Prisma.QueryMode.insensitive } }),
    };
    const skip = (page - 1) * limit;
    const [total, items] = await this.prisma.$transaction([
      this.prisma.catalogoGlobal.count({ where }),
      this.prisma.catalogoGlobal.findMany({
        where, skip, take: limit,
        orderBy: [{ categoria: 'asc' }, { modelo: 'asc' }],
        include: { _count: { select: { catalogoItems: true } } },
      }),
    ]);
    return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPrevPage: page > 1 } };
  }

  async findOne(id: string) {
    const item = await this.prisma.catalogoGlobal.findUnique({
      where: { id },
      include: {
        _count: { select: { catalogoItems: true } },
        catalogoItems: {
          where: { isActive: true },
          include: {
            puntoDeVenta: { select: { id: true, nombre: true, ciudad: true } },
            _count: { select: { dispositivos: true, accesorios: true } },
          },
        },
      },
    });
    if (!item) throw new NotFoundException(`Ítem global "${id}" no encontrado`);
    return item;
  }

  async update(id: string, dto: UpdateCatalogoGlobalDto) {
    await this.findOne(id);
    return this.prisma.catalogoGlobal.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.catalogoGlobal.update({ where: { id }, data: { isActive: false } });
    return { message: `Plantilla "${id}" desactivada correctamente` };
  }
}