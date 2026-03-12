import { Test, TestingModule } from '@nestjs/testing';
import { AccesoriosService } from './accesorios.service';

describe('AccesoriosService', () => {
  let service: AccesoriosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccesoriosService],
    }).compile();

    service = module.get<AccesoriosService>(AccesoriosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
