import { Test, TestingModule } from '@nestjs/testing';
import { SiteInfoService } from './site-info.service';

describe('SiteInfoService', () => {
  let service: SiteInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SiteInfoService],
    }).compile();

    service = module.get<SiteInfoService>(SiteInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
