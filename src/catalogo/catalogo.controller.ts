// src/catalogo/catalogo.controller.ts
import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, HttpCode, HttpStatus,
  UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CatalogoService } from './catalogo.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { FilterCatalogoDto } from './dto/filter-catalogo.dto';
import { UpdateCatalogoItemDto } from './dto/update-catalogo-item.dto';
import { CreateCatalogoItemDto } from './dto/create-catalogo-item.dto';

@Controller('catalogo')
@UseGuards(JwtAccessGuard, RolesGuard)
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  /**
   * POST /catalogo
   * Crea un ítem en el catálogo de un PdV. Solo ADMIN.
   */
  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCatalogoItemDto) {
    return this.catalogoService.create(dto);
  }

  /**
   * GET /catalogo
   * Lista todos los ítems de catálogo (todos los PdV) con filtros.
   */
  @Get()
  findAll(@Query() filters: FilterCatalogoDto) {
    return this.catalogoService.findAll(filters);
  }

  /**
   * GET /catalogo/pdv/:puntoDeVentaId
   * Lista el catálogo de un PdV específico, agrupado por categoría en el response.
   */
  @Get('pdv/:puntoDeVentaId')
  findByPdv(
    @Param('puntoDeVentaId', ParseUUIDPipe) puntoDeVentaId: string,
    @Query() filters: FilterCatalogoDto,
  ) {
    return this.catalogoService.findByPdv(puntoDeVentaId, filters);
  }

  /**
   * GET /catalogo/:id
   * Obtiene un ítem de catálogo por ID.
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.catalogoService.findOne(id);
  }

  /**
   * PATCH /catalogo/:id
   * Actualiza un ítem del catálogo. Solo ADMIN.
   */
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCatalogoItemDto,
  ) {
    return this.catalogoService.update(id, dto);
  }

  /**
   * DELETE /catalogo/:id
   * Soft delete de un ítem del catálogo. Solo ADMIN.
   */
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.catalogoService.remove(id);
  }
}