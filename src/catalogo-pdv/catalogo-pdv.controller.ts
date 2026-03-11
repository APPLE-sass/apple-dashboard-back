import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { CatalogoPdvService } from './catalogo-pdv.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { AssignCatalogoDto } from './dto/assign-catalogo.dto';
import { UpdatePrecioLocalDto } from './dto/update-precio-local.dto';

@Controller('catalogo-pdv')
@UseGuards(JwtAccessGuard)
export class CatalogoPdvController {
  constructor(private readonly service: CatalogoPdvService) {}

  // POST /catalogo-pdv/assign — asignar plantilla global a un PdV
  @Post('assign') @HttpCode(HttpStatus.CREATED)
  assign(@Body() dto: AssignCatalogoDto) { return this.service.assign(dto); }

  // GET /catalogo-pdv/pdv/:puntoDeVentaId — catálogo completo del PdV
  @Get('pdv/:puntoDeVentaId')
  findByPdv(@Param('puntoDeVentaId', ParseUUIDPipe) puntoDeVentaId: string) { return this.service.findByPdv(puntoDeVentaId); }

  // GET /catalogo-pdv/pdv/:puntoDeVentaId/:catalogoItemId — detalle con dispositivos y accesorios
  @Get('pdv/:puntoDeVentaId/:catalogoItemId')
  findOneInPdv(
    @Param('puntoDeVentaId', ParseUUIDPipe) puntoDeVentaId: string,
    @Param('catalogoItemId', ParseUUIDPipe) catalogoItemId: string,
  ) { return this.service.findOneInPdv(puntoDeVentaId, catalogoItemId); }

  // PATCH /catalogo-pdv/:id — actualizar precio local
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePrecioLocalDto) { return this.service.updatePrecioLocal(id, dto); }

  // DELETE /catalogo-pdv/:id — desvincular del PdV
  @Delete(':id') @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}