// src/punto-de-venta/punto-de-venta.controller.ts
import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, HttpCode, HttpStatus,
  UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PuntoDeVentaService } from './punto-de-venta.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreatePdvDto } from './dto/create-pdv.dto';
import { UpdatePdvDto } from './dto/update-pdv';

@Controller('puntos-de-venta')
@UseGuards(JwtAccessGuard, RolesGuard)
export class PuntoDeVentaController {
  constructor(private readonly pdvService: PuntoDeVentaService) {}

  /** POST /puntos-de-venta — Solo ADMIN */
  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePdvDto) {
    return this.pdvService.create(dto);
  }

  /** GET /puntos-de-venta */
  @Get()
  findAll() {
    return this.pdvService.findAll();
  }

  /** GET /puntos-de-venta/:id */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pdvService.findOne(id);
  }

  /** PATCH /puntos-de-venta/:id — Solo ADMIN */
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePdvDto,
  ) {
    return this.pdvService.update(id, dto);
  }

  /** DELETE /puntos-de-venta/:id — Solo ADMIN (soft delete) */
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pdvService.remove(id);
  }

  /** GET /puntos-de-venta/:id/productos — Unidades físicas del PdV */
  @Get(':id/productos')
  findProductos(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('categoria') categoria?: string,
    @Query('usado') usado?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.pdvService.findUnidades(id, {
      categoria,
      usado: usado !== undefined ? usado === 'true' : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }
}