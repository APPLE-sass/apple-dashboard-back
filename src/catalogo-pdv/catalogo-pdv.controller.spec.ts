import { Test, TestingModule } from '@nestjs/testing';
import { CatalogoPdvController } from './catalogo-pdv.controller';
import { CatalogoPdvService } from './catalogo-pdv.service';

describe('CatalogoPdvController', () => {
  let controller: CatalogoPdvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogoPdvController],
      providers: [CatalogoPdvService],
    }).compile();

    controller = module.get<CatalogoPdvController>(CatalogoPdvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
