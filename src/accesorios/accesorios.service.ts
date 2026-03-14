import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccesorioDto } from './dto/create-accesorio.dto';
import { UpdateAccesorioDto } from './dto/update-accesorio.dto';

@Injectable()
export class AccesoriosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAccesorioDto) {
    return this.prisma.accesorio.create({
      data: {
        nombre: dto.nombre,
        modelo: dto.modelo,
        tipo: dto.tipo,
        descripcion: dto.descripcion,
        cantidad: dto.cantidad ?? 0,
        colores: {
          create: dto.colores?.map((color) => ({ color })) ?? [],
        },
        imagenes: {
          create: dto.imagenes?.map((url, i) => ({ url, orden: i })) ?? [],
        },
        puntoDeVentaId: dto.puntoDeVentaId,
      },
      include: { colores: true, imagenes: true },
    });
  }

  async findAll(filters?: { nombre?: string; tipo?: string; puntoDeVentaId?: string }) {
    return this.prisma.accesorio.findMany({
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
    const accesorio = await this.prisma.accesorio.findUnique({
      where: { id },
      include: { colores: true, imagenes: { orderBy: { orden: 'asc' } } },
    });
    if (!accesorio) throw new NotFoundException('Accesorio no encontrado');
    return accesorio;
  }

  async update(id: string, dto: UpdateAccesorioDto) {
    await this.findOne(id);

    return this.prisma.accesorio.update({
      where: { id },
      data: {
        nombre: dto.nombre,
        modelo: dto.modelo,
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
    return this.prisma.accesorio.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, nombre: true, isActive: true },
    });
  }
}