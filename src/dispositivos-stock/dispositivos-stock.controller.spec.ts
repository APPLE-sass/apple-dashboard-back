import { Test, TestingModule } from '@nestjs/testing';
import { DispositivosStockController } from './dispositivos-stock.controller';
import { DispositivosStockService } from './dispositivos-stock.service';

describe('DispositivosStockController', () => {
  let controller: DispositivosStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DispositivosStockController],
      providers: [DispositivosStockService],
    }).compile();

    controller = module.get<DispositivosStockController>(DispositivosStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
