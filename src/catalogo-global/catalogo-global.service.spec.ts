import { Test, TestingModule } from '@nestjs/testing';
import { CatalogoGlobalService } from './catalogo-global.service';

describe('CatalogoGlobalService', () => {
  let service: CatalogoGlobalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogoGlobalService],
    }).compile();

    service = module.get<CatalogoGlobalService>(CatalogoGlobalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
