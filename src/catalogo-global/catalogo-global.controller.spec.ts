import { Test, TestingModule } from '@nestjs/testing';
import { CatalogoGlobalController } from './catalogo-global.controller';
import { CatalogoGlobalService } from './catalogo-global.service';

describe('CatalogoGlobalController', () => {
  let controller: CatalogoGlobalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogoGlobalController],
      providers: [CatalogoGlobalService],
    }).compile();

    controller = module.get<CatalogoGlobalController>(CatalogoGlobalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
