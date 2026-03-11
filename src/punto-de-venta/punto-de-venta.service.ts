import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePdvDto } from './dto/create-pdv.dto';
import { UpdatePdvDto } from './dto/update-pdv';

@Injectable()
export class PuntoDeVentaService {
  constructor(private readonly prisma: PrismaService) { }

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
            dispositivos: true,
            accesorios: { where: { isActive: true } },
          },
        },
      },
    });
  }

  async findUnidades(
    id: string,
    filters: {
      categoria?: string;
      usado?: boolean;
      page: number;
      limit: number;
    },
  ) {
    await this.findOne(id); // valida que el PdV existe

    const { categoria, usado, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      puntoDeVentaId: id,
      ...(usado !== undefined && { usado }),
      ...(categoria && {
        catalogoItem: {
          catalogoGlobal: { categoria: categoria as any },
        },
      }),
    };

    const [dispositivos, accesorios, totalDispositivos, totalAccesorios] =
      await Promise.all([
        this.prisma.dispositivoStock.findMany({
          where,
          skip,
          take: limit,
          include: {
            catalogoItem: { include: { catalogoGlobal: true } },
            proveedor: { select: { id: true, nombre: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.accesorioStock.findMany({
          where: {
            puntoDeVentaId: id,
            isActive: true,
            ...(categoria && {
              catalogoItem: {
                catalogoGlobal: { categoria: categoria as any },
              },
            }),
          },
          skip,
          take: limit,
          include: {
            catalogoItem: { include: { catalogoGlobal: true } },
          },
        }),
        this.prisma.dispositivoStock.count({ where }),
        this.prisma.accesorioStock.count({
          where: {
            puntoDeVentaId: id,
            isActive: true,
            ...(categoria && {
              catalogoItem: {
                catalogoGlobal: { categoria: categoria as any },
              },
            }),
          },
        }),
      ]);

    return {
      dispositivos: {
        data: dispositivos,
        total: totalDispositivos,
        page,
        limit,
        totalPages: Math.ceil(totalDispositivos / limit),
      },
      accesorios: {
        data: accesorios,
        total: totalAccesorios,
        page,
        limit,
        totalPages: Math.ceil(totalAccesorios / limit),
      },
    };
  }

  async findOne(id: string) {
    const pdv = await this.prisma.puntoDeVenta.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            catalogoItems: { where: { isActive: true } },
            dispositivos: true,
            accesorios: { where: { isActive: true } },
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
    await this.prisma.puntoDeVenta.update({ where: { id }, data: { isActive: false } });
    return { message: `Punto de venta "${id}" desactivado correctamente` };
  }
}