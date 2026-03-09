import { Test, TestingModule } from '@nestjs/testing';
import { PuntoDeVentaService } from './punto-de-venta.service';

describe('PuntoDeVentaService', () => {
  let service: PuntoDeVentaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PuntoDeVentaService],
    }).compile();

    service = module.get<PuntoDeVentaService>(PuntoDeVentaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
