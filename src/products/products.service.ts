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

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────

  /** Luhn (mod-10) checksum */
  private passesLuhn(imei: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let i = imei.length - 1; i >= 0; i--) {
      let digit = parseInt(imei.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

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

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────

  async create(dto: CreateProductDto) {
    if (!dto.imei) {
      throw new UnprocessableEntityException('El IMEI es obligatorio');
    }

    this.validateImei(dto.imei);

    const existing = await this.prisma.unidadFisica.findUnique({
      where: { imei: dto.imei },
    });

    if (existing) {
      throw new ConflictException(
        `Ya existe una unidad con el IMEI "${dto.imei}"`,
      );
    }

    return this.prisma.unidadFisica.create({
      data: {
        imei: dto.imei,
        bateria: dto.bateria,
        usado: dto.usado ?? false,

        catalogoItemId: dto.catalogoItemId,
        puntoDeVentaId: dto.puntoDeVentaId,
        proveedorId: dto.proveedorId,
      },
      include: {
        catalogoItem: {
          select: {
            id: true,
            modelo: true,
            memoria: true,
            color: true,
            categoria: true,
            precio: true,
          },
        },
        puntoDeVenta: {
          select: {
            id: true,
            nombre: true,
            ciudad: true,
          },
        },
        proveedor: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }

  // ─────────────────────────────────────────────
  // FIND ALL
  // ─────────────────────────────────────────────

  async findAll(filters: FilterProductsDto) {
    const { usado, page = 1, limit = 10 } = filters;

    const where: Prisma.UnidadFisicaWhereInput = {
      ...(usado !== undefined && { usado }),
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
            select: {
              id: true,
              modelo: true,
              memoria: true,
              color: true,
              categoria: true,
              precio: true,
            },
          },
          puntoDeVenta: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  // ─────────────────────────────────────────────
  // FIND ONE
  // ─────────────────────────────────────────────

  async findOne(id: string) {
    const unidad = await this.prisma.unidadFisica.findUnique({
      where: { id },
      include: {
        catalogoItem: true,
        puntoDeVenta: true,
        proveedor: true,
      },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con id "${id}" no encontrada`);
    }

    return unidad;
  }

  // ─────────────────────────────────────────────
  // FIND BY IMEI
  // ─────────────────────────────────────────────

  async findByImei(imei: string) {
    const unidad = await this.prisma.unidadFisica.findUnique({
      where: { imei },
      include: {
        catalogoItem: true,
        puntoDeVenta: true,
        proveedor: true,
      },
    });

    if (!unidad) {
      throw new NotFoundException(
        `No se encontró una unidad con el IMEI "${imei}"`,
      );
    }

    return unidad;
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    if (dto.imei) {
      this.validateImei(dto.imei);

      const existing = await this.prisma.unidadFisica.findUnique({
        where: { imei: dto.imei },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Ya existe otra unidad con el IMEI "${dto.imei}"`,
        );
      }
    }

    return this.prisma.unidadFisica.update({
      where: { id },
      data: {
        ...(dto.imei !== undefined && { imei: dto.imei }),
        ...(dto.bateria !== undefined && { bateria: dto.bateria }),
        ...(dto.usado !== undefined && { usado: dto.usado }),
        ...(dto.catalogoItemId !== undefined && {
          catalogoItemId: dto.catalogoItemId,
        }),
        ...(dto.puntoDeVentaId !== undefined && {
          puntoDeVentaId: dto.puntoDeVentaId,
        }),
        ...(dto.proveedorId !== undefined && {
          proveedorId: dto.proveedorId,
        }),
      },
      include: {
        catalogoItem: true,
        puntoDeVenta: true,
        proveedor: true,
      },
    });
  }

  // ─────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.unidadFisica.delete({
      where: { id },
    });

    return { message: `Unidad "${id}" eliminada correctamente` };
  }
}