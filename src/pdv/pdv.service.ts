import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePuntoDeVentaDto } from './dto/create-pdv.dto';
import { UpdatePuntoDeVentaDto } from './dto/update-pdv.dto';

@Injectable()
export class PuntoDeVentaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePuntoDeVentaDto) {
    return this.prisma.puntoDeVenta.create({
      data: {
        nombre: dto.nombre,
        direccion: dto.direccion,
        ciudad: dto.ciudad,
      },
    });
  }

  async findAll() {
    return this.prisma.puntoDeVenta.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const pdv = await this.prisma.puntoDeVenta.findUnique({
      where: { id },
    });
    if (!pdv) throw new NotFoundException('Punto de venta no encontrado');
    return pdv;
  }

  async update(id: string, dto: UpdatePuntoDeVentaDto) {
    await this.findOne(id);
    return this.prisma.puntoDeVenta.update({
      where: { id },
      data: {
        nombre: dto.nombre,
        direccion: dto.direccion,
        ciudad: dto.ciudad,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.puntoDeVenta.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, nombre: true, isActive: true },
    });
  }
}