import { Test, TestingModule } from '@nestjs/testing';
import { AccesoriosStockService } from './accesorios-stock.service';

describe('AccesoriosStockService', () => {
  let service: AccesoriosStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccesoriosStockService],
    }).compile();

    service = module.get<AccesoriosStockService>(AccesoriosStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
