import { Test, TestingModule } from '@nestjs/testing';
import { PdvController } from './pdv.controller';
import { PdvService } from './pdv.service';

describe('PdvController', () => {
  let controller: PdvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdvController],
      providers: [PdvService],
    }).compile();

    controller = module.get<PdvController>(PdvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
