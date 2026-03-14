import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AccesoriosService } from './accesorios.service';
import { CreateAccesorioDto } from './dto/create-accesorio.dto';
import { UpdateAccesorioDto } from './dto/update-accesorio.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';

@UseGuards(JwtAccessGuard)
@Controller('accesorios')
export class AccesoriosController {
  constructor(private readonly accesoriosService: AccesoriosService) {}

  @Post()
  create(@Body() dto: CreateAccesorioDto) {
    return this.accesoriosService.create(dto);
  }

  @Get()
  findAll(
    @Query('nombre') nombre?: string,
    @Query('tipo') tipo?: string,
    @Query('puntoDeVentaId') puntoDeVentaId?: string,
  ) {
    return this.accesoriosService.findAll({ nombre, tipo, puntoDeVentaId });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accesoriosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAccesorioDto) {
    return this.accesoriosService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accesoriosService.remove(id);
  }
}