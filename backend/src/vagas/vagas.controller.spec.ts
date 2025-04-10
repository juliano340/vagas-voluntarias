import { Test, TestingModule } from '@nestjs/testing';
import { VagasController } from './vagas.controller';
import { VagasService } from './vagas.service';

describe('VagasController', () => {
  let controller: VagasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VagasController],
      providers: [VagasService],
    }).compile();

    controller = module.get<VagasController>(VagasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
