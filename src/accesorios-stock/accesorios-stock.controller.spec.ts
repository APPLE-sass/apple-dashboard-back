import { Test, TestingModule } from '@nestjs/testing';
import { AccesoriosStockController } from './accesorios-stock.controller';
import { AccesoriosStockService } from './accesorios-stock.service';

describe('AccesoriosStockController', () => {
  let controller: AccesoriosStockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccesoriosStockController],
      providers: [AccesoriosStockService],
    }).compile();

    controller = module.get<AccesoriosStockController>(AccesoriosStockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
