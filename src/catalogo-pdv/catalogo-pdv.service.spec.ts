import { Test, TestingModule } from '@nestjs/testing';
import { CatalogoPdvService } from './catalogo-pdv.service';

describe('CatalogoPdvService', () => {
  let service: CatalogoPdvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogoPdvService],
    }).compile();

    service = module.get<CatalogoPdvService>(CatalogoPdvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
