import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { Role } from '@prisma/client';
import { DispositivosStockService } from './dispositivos-stock.service';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from './dto/update-dispositivos.dto';
import { FilterDispositivoDto } from './dto/filter-dispositivo.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('dispositivos-stock')
@UseGuards(JwtAccessGuard, RolesGuard)
export class DispositivosStockController {
  constructor(private readonly service: DispositivosStockService) {}

  @Post() @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateDispositivoDto) { return this.service.create(dto); }

  @Get()
  findAll(@Query() filters: FilterDispositivoDto) { return this.service.findAll(filters); }

  @Get('imei/:imei')
  findByImei(@Param('imei') imei: string) { return this.service.findByImei(imei); }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDispositivoDto) { return this.service.update(id, dto); }

  @Delete(':id') @Roles(Role.ADMIN) @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}