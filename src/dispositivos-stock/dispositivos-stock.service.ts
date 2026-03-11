import { Injectable, NotFoundException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from './dto/update-dispositivos.dto';
import { FilterDispositivoDto } from './dto/filter-dispositivo.dto';

@Injectable()
export class DispositivosStockService {
  constructor(private readonly prisma: PrismaService) {}

  private passesLuhn(imei: string): boolean {
    let sum = 0, shouldDouble = false;
    for (let i = imei.length - 1; i >= 0; i--) {
      let digit = parseInt(imei.charAt(i), 10);
      if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
      sum += digit; shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  private validateImei(imei: string) {
    if (!this.passesLuhn(imei)) throw new UnprocessableEntityException(`El IMEI "${imei}" no supera la validación de Luhn.`);
  }

  async create(dto: CreateDispositivoDto) {
    this.validateImei(dto.imei);

    const existing = await this.prisma.dispositivoStock.findUnique({ where: { imei: dto.imei } });
    if (existing) throw new ConflictException(`Ya existe un dispositivo con el IMEI "${dto.imei}"`);

    const catalogoItem = await this.prisma.catalogoItem.findUnique({ where: { id: dto.catalogoItemId } });
    if (!catalogoItem || catalogoItem.puntoDeVentaId !== dto.puntoDeVentaId) {
      throw new NotFoundException(`El ítem de catálogo "${dto.catalogoItemId}" no pertenece a este punto de venta`);
    }

    return this.prisma.dispositivoStock.create({
      data: { imei: dto.imei, bateria: dto.bateria, usado: dto.usado ?? false, estado: dto.estado ?? 'DISPONIBLE', notas: dto.notas, catalogoItemId: dto.catalogoItemId, puntoDeVentaId: dto.puntoDeVentaId, proveedorId: dto.proveedorId },
      include: { catalogoItem: { include: { catalogoGlobal: true } }, puntoDeVenta: { select: { id: true, nombre: true } }, proveedor: { select: { id: true, nombre: true } } },
    });
  }

  async findAll(filters: FilterDispositivoDto) {
    const { puntoDeVentaId, catalogoItemId, usado, estado, page = 1, limit = 20 } = filters;
    const where: Prisma.DispositivoStockWhereInput = {
      ...(puntoDeVentaId && { puntoDeVentaId }),
      ...(catalogoItemId && { catalogoItemId }),
      ...(usado !== undefined && { usado }),
      ...(estado && { estado }),
    };
    const skip = (page - 1) * limit;
    const [total, items] = await this.prisma.$transaction([
      this.prisma.dispositivoStock.count({ where }),
      this.prisma.dispositivoStock.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { catalogoItem: { include: { catalogoGlobal: { select: { modelo: true, categoria: true, precioSugerido: true } } } }, puntoDeVenta: { select: { id: true, nombre: true } } },
      }),
    ]);
    return { items, meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPrevPage: page > 1 } };
  }

  async findOne(id: string) {
    const d = await this.prisma.dispositivoStock.findUnique({
      where: { id },
      include: { catalogoItem: { include: { catalogoGlobal: true } }, puntoDeVenta: true, proveedor: true, historial: { orderBy: { createdAt: 'desc' } } },
    });
    if (!d) throw new NotFoundException(`Dispositivo "${id}" no encontrado`);
    return d;
  }

  async findByImei(imei: string) {
    const d = await this.prisma.dispositivoStock.findUnique({
      where: { imei },
      include: { catalogoItem: { include: { catalogoGlobal: true } }, puntoDeVenta: true, proveedor: true },
    });
    if (!d) throw new NotFoundException(`No se encontró dispositivo con IMEI "${imei}"`);
    return d;
  }

  async update(id: string, dto: UpdateDispositivoDto) {
    const current = await this.findOne(id);
    if (dto.imei && dto.imei !== current.imei) {
      this.validateImei(dto.imei);
      const exists = await this.prisma.dispositivoStock.findUnique({ where: { imei: dto.imei } });
      if (exists) throw new ConflictException(`Ya existe otro dispositivo con IMEI "${dto.imei}"`);
    }
    return this.prisma.dispositivoStock.update({
      where: { id },
      data: {
        ...(dto.imei !== undefined && { imei: dto.imei }),
        ...(dto.bateria !== undefined && { bateria: dto.bateria }),
        ...(dto.usado !== undefined && { usado: dto.usado }),
        ...(dto.estado !== undefined && { estado: dto.estado }),
        ...(dto.notas !== undefined && { notas: dto.notas }),
        ...(dto.catalogoItemId !== undefined && { catalogoItemId: dto.catalogoItemId }),
        ...(dto.puntoDeVentaId !== undefined && { puntoDeVentaId: dto.puntoDeVentaId }),
        ...(dto.proveedorId !== undefined && { proveedorId: dto.proveedorId }),
      },
      include: { catalogoItem: { include: { catalogoGlobal: true } }, puntoDeVenta: { select: { id: true, nombre: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.dispositivoStock.delete({ where: { id } });
    return { message: `Dispositivo "${id}" eliminado correctamente` };
  }
}