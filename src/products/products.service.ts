// src/products/products.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────────

  /** Luhn (mod-10) checksum */
  private passesLuhn(imei: string): boolean {
    let sum = 0;
    let shouldDouble = false;
    for (let i = imei.length - 1; i >= 0; i--) {
      let digit = parseInt(imei.charAt(i), 10);
      if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  private validateImei(imei: string) {
    if (!this.passesLuhn(imei)) {
      throw new UnprocessableEntityException(
        `El IMEI "${imei}" no supera la validación del algoritmo de Luhn.`,
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CRUD
  // ─────────────────────────────────────────────────────────────────────────────

  async create(dto: CreateProductDto) {
    if (dto.imei) {
      this.validateImei(dto.imei);

      // Verificar unicidad del IMEI
      const existing = await this.prisma.producto.findUnique({ where: { imei: dto.imei } });
      if (existing) throw new ConflictException(`Ya existe un producto con el IMEI "${dto.imei}"`);
    }

    return this.prisma.producto.create({
      data: {
        modelo:    dto.modelo,
        categoria: dto.categoria,
        memoria:   dto.memoria,
        color:     dto.color,
        precio:    dto.precio,
        bateria:   dto.bateria,
        usado:     dto.usado ?? false,
        stock:     dto.stock,
        imei:      dto.imei ?? null,
        ...(dto.catalogoItemId  && { catalogoItemId:  dto.catalogoItemId }),
        ...(dto.puntoDeVentaId  && { puntoDeVentaId:  dto.puntoDeVentaId }),
        ...(dto.proveedorId     && { proveedorId:     dto.proveedorId }),
      },
      include: {
        catalogoItem:  { select: { id: true, modelo: true, categoria: true } },
        puntoDeVenta:  { select: { id: true, nombre: true } },
      },
    });
  }

  async findAll(filters: FilterProductsDto) {
    const {
      categoria, modelo, memoria, color, usado,
      minPrice, maxPrice, stockDisponible, page = 1, limit = 10,
    } = filters;

    const where: Prisma.ProductoWhereInput = {
      ...(categoria && { categoria }),
      ...(modelo    && { modelo: { contains: modelo, mode: Prisma.QueryMode.insensitive } }),
      ...(memoria   && { memoria }),
      ...(color     && { color:  { contains: color,  mode: Prisma.QueryMode.insensitive } }),
      ...(usado !== undefined && { usado }),
      ...(stockDisponible && { stock: { gt: 0 } }),
      ...((minPrice !== undefined || maxPrice !== undefined) && {
        precio: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      }),
    };

    const skip = (page - 1) * limit;

    const [total, items] = await this.prisma.$transaction([
      this.prisma.producto.count({ where }),
      this.prisma.producto.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          catalogoItem: { select: { id: true, modelo: true, categoria: true } },
          puntoDeVenta: { select: { id: true, nombre: true } },
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

  async findOne(id: string) {
    const product = await this.prisma.producto.findUnique({
      where: { id },
      include: {
        catalogoItem: { select: { id: true, modelo: true, categoria: true, precioBase: true } },
        puntoDeVenta: { select: { id: true, nombre: true, ciudad: true } },
      },
    });
    if (!product) throw new NotFoundException(`Producto con id "${id}" no encontrado`);
    return product;
  }

  async findByImei(imei: string) {
    const product = await this.prisma.producto.findUnique({
      where: { imei },
      include: {
        catalogoItem: { select: { id: true, modelo: true, categoria: true } },
        puntoDeVenta: { select: { id: true, nombre: true } },
      },
    });
    if (!product) throw new NotFoundException(`No se encontró un producto con el IMEI "${imei}"`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.imei) {
      this.validateImei(dto.imei);
      const existing = await this.prisma.producto.findUnique({ where: { imei: dto.imei } });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Ya existe otro producto con el IMEI "${dto.imei}"`);
      }
    }

    return this.prisma.producto.update({
      where: { id },
      data: {
        ...(dto.modelo          !== undefined && { modelo:          dto.modelo }),
        ...(dto.categoria       !== undefined && { categoria:       dto.categoria }),
        ...(dto.memoria         !== undefined && { memoria:         dto.memoria }),
        ...(dto.color           !== undefined && { color:           dto.color }),
        ...(dto.precio          !== undefined && { precio:          dto.precio }),
        ...(dto.bateria         !== undefined && { bateria:         dto.bateria }),
        ...(dto.usado           !== undefined && { usado:           dto.usado }),
        ...(dto.stock           !== undefined && { stock:           dto.stock }),
        ...(dto.imei            !== undefined && { imei:            dto.imei }),
        ...(dto.catalogoItemId  !== undefined && { catalogoItemId:  dto.catalogoItemId }),
        ...(dto.puntoDeVentaId  !== undefined && { puntoDeVentaId:  dto.puntoDeVentaId }),
        ...(dto.proveedorId     !== undefined && { proveedorId:     dto.proveedorId }),
      },
      include: {
        catalogoItem: { select: { id: true, modelo: true, categoria: true } },
        puntoDeVenta: { select: { id: true, nombre: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.producto.delete({ where: { id } });
    return { message: `Producto "${id}" eliminado correctamente` };
  }
}