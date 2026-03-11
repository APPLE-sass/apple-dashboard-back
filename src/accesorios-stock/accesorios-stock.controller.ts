import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AccesoriosStockService } from './accesorios-stock.service';
import { CreateAccesorioDto } from './dto/create-accesorios.dto';
import { UpdateAccesorioDto } from './dto/update-accesorios.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('accesorios-stock')
@UseGuards(JwtAccessGuard, RolesGuard)
export class AccesoriosStockController {
  constructor(private readonly service: AccesoriosStockService) {}

  @Post() @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAccesorioDto) { return this.service.create(dto); }

  @Get()
  findAll(
    @Query('puntoDeVentaId') puntoDeVentaId?: string,
    @Query('catalogoItemId') catalogoItemId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) { return this.service.findAll({ puntoDeVentaId, catalogoItemId, page: page ? +page : 1, limit: limit ? +limit : 20 }); }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAccesorioDto) { return this.service.update(id, dto); }

  // PATCH /accesorios-stock/:id/cantidad  body: { delta: 5 } o { delta: -3 }
  @Patch(':id/cantidad')
  ajustarCantidad(@Param('id', ParseUUIDPipe) id: string, @Body('delta') delta: number) { return this.service.ajustarCantidad(id, delta); }

  @Delete(':id') @Roles(Role.ADMIN) @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}