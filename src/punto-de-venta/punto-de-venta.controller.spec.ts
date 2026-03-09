import { Test, TestingModule } from '@nestjs/testing';
import { PuntoDeVentaController } from './punto-de-venta.controller';
import { PuntoDeVentaService } from './punto-de-venta.service';

describe('PuntoDeVentaController', () => {
  let controller: PuntoDeVentaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PuntoDeVentaController],
      providers: [PuntoDeVentaService],
    }).compile();

    controller = module.get<PuntoDeVentaController>(PuntoDeVentaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
