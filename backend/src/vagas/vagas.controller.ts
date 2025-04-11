import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VagasService } from './vagas.service';
import { CreateVagasDto } from './dto/create-vagas.dto';
import { UpdateVagasDto } from './dto/update-vagas.dto';
import { UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('vagas')
export class VagasController {
  constructor(private readonly vagasService: VagasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createVagasDto: CreateVagasDto, @Request() req) {
    return this.vagasService.create(createVagasDto, req.user);
  }
  

  @Get()
findAll(@Query('localidade') localidade?: string, @Query('titulo') titulo?: string) {
  return this.vagasService.findAll({ localidade, titulo });
}


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vagasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVagasDto: UpdateVagasDto) {
    return this.vagasService.update(+id, updateVagasDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vagasService.remove(+id);
  }
}
