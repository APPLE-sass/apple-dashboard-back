import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { PuntoDeVentaService } from './pdv.service';
import { CreatePuntoDeVentaDto } from './dto/create-pdv.dto';
import { UpdatePuntoDeVentaDto } from './dto/update-pdv.dto';

@UseGuards(JwtAccessGuard)
@Controller('pdv')
export class PuntoDeVentaController {
  constructor(private readonly puntoDeVentaService: PuntoDeVentaService) {}

  @Post()
  create(@Body() dto: CreatePuntoDeVentaDto) {
    return this.puntoDeVentaService.create(dto);
  }

  @Get()
  findAll() {
    return this.puntoDeVentaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.puntoDeVentaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePuntoDeVentaDto) {
    return this.puntoDeVentaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.puntoDeVentaService.remove(id);
  }
}