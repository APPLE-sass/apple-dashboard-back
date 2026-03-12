import { Test, TestingModule } from '@nestjs/testing';
import { PdvService } from './pdv.service';

describe('PdvService', () => {
  let service: PdvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdvService],
    }).compile();

    service = module.get<PdvService>(PdvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
