import { Test, TestingModule } from '@nestjs/testing';
import { DispositivosStockService } from './dispositivos-stock.service';

describe('DispositivosStockService', () => {
  let service: DispositivosStockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DispositivosStockService],
    }).compile();

    service = module.get<DispositivosStockService>(DispositivosStockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
