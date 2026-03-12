import { Test, TestingModule } from '@nestjs/testing';
import { AccesoriosController } from './accesorios.controller';
import { AccesoriosService } from './accesorios.service';

describe('AccesoriosController', () => {
  let controller: AccesoriosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccesoriosController],
      providers: [AccesoriosService],
    }).compile();

    controller = module.get<AccesoriosController>(AccesoriosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
