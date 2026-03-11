import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { CatalogoGlobalService } from './catalogo-global.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CreateCatalogoGlobalDto } from './dto/create-catalogo-global.dto';
import { UpdateCatalogoGlobalDto } from './dto/update-catalogo-global.dto';
import { FilterCatalogoGlobalDto } from './dto/filter-catalogo-global.dto';

@Controller('catalogo-global')
@UseGuards(JwtAccessGuard)
export class CatalogoGlobalController {
  constructor(private readonly service: CatalogoGlobalService) {}

  @Post() @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCatalogoGlobalDto) { return this.service.create(dto); }

  @Get()
  findAll(@Query() filters: FilterCatalogoGlobalDto) { return this.service.findAll(filters); }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCatalogoGlobalDto) { return this.service.update(id, dto); }

  @Delete(':id') @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}