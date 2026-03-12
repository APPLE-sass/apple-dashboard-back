import { Test, TestingModule } from '@nestjs/testing';
import { SubAccesoriosService } from './sub-accesorios.service';

describe('SubAccesoriosService', () => {
  let service: SubAccesoriosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubAccesoriosService],
    }).compile();

    service = module.get<SubAccesoriosService>(SubAccesoriosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
