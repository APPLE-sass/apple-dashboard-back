import { Test, TestingModule } from '@nestjs/testing';
import { SubAccesoriosController } from './sub-accesorios.controller';
import { SubAccesoriosService } from './sub-accesorios.service';

describe('SubAccesoriosController', () => {
  let controller: SubAccesoriosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubAccesoriosController],
      providers: [SubAccesoriosService],
    }).compile();

    controller = module.get<SubAccesoriosController>(SubAccesoriosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
