import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubAccesorioDto } from './dto/create-sub-accesorio.dto';
import { UpdateSubAccesorioDto } from './dto/update-sub-accesorio.dto';

@Injectable()
export class SubAccesoriosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSubAccesorioDto) {
    return this.prisma.subAccesorio.create({
      data: {
        nombre: dto.nombre,
        tipo: dto.tipo,
        descripcion: dto.descripcion,
        cantidad: dto.cantidad ?? 0,
        colores: {
          create: dto.colores?.map((color) => ({ color })) ?? [],
        },
        imagenes: {
          create: dto.imagenes?.map((url, i) => ({ url, orden: i })) ?? [],
        },
        puntoDeVentaId: dto.puntoDeVentaId
      },
      include: { colores: true, imagenes: true },
    });
  }

  async findAll(filters?: { nombre?: string; tipo?: string; puntoDeVentaId?: string }) {
    return this.prisma.subAccesorio.findMany({
      where: {
        isActive: true,
        ...(filters?.nombre && {
          nombre: { contains: filters.nombre, mode: 'insensitive' },
        }),
        ...(filters?.tipo && { tipo: filters.tipo }),
        ...(filters?.puntoDeVentaId && { puntoDeVentaId: filters.puntoDeVentaId }),
      },
      include: { colores: true, imagenes: { orderBy: { orden: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const sub = await this.prisma.subAccesorio.findUnique({
      where: { id },
      include: { colores: true, imagenes: { orderBy: { orden: 'asc' } } },
    });
    if (!sub) throw new NotFoundException('SubAccesorio no encontrado');
    return sub;
  }

  async update(id: string, dto: UpdateSubAccesorioDto) {
    await this.findOne(id);

    return this.prisma.subAccesorio.update({
      where: { id },
      data: {
        nombre: dto.nombre,
        tipo: dto.tipo,
        descripcion: dto.descripcion,
        cantidad: dto.cantidad,
        colores: dto.colores
          ? {
              deleteMany: {},
              create: dto.colores.map((color) => ({ color })),
            }
          : undefined,
        imagenes: dto.imagenes
          ? {
              deleteMany: {},
              create: dto.imagenes.map((url, i) => ({ url, orden: i })),
            }
          : undefined,
      },
      include: { colores: true, imagenes: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.subAccesorio.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, nombre: true, isActive: true },
    });
  }
}