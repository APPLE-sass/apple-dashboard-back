import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SubAccesoriosService } from './sub-accesorios.service';
import { CreateSubAccesorioDto } from './dto/create-sub-accesorio.dto';
import { UpdateSubAccesorioDto } from './dto/update-sub-accesorio.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';

@UseGuards(JwtAccessGuard)
@Controller('sub-accesorios')
export class SubAccesoriosController {
  constructor(private readonly subAccesoriosService: SubAccesoriosService) {}

  @Post()
  create(@Body() dto: CreateSubAccesorioDto) {
    return this.subAccesoriosService.create(dto);
  }

  @Get()
  findAll(
    @Query('nombre') nombre?: string,
    @Query('tipo') tipo?: string,
    @Query('puntoDeVentaId') puntoDeVentaId?: string,
  ) {
    return this.subAccesoriosService.findAll({ nombre, tipo, puntoDeVentaId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subAccesoriosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSubAccesorioDto) {
    return this.subAccesoriosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subAccesoriosService.remove(id);
  }
}