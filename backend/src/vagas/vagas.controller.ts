import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UnauthorizedException, ParseIntPipe } from '@nestjs/common';
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


@Get('minhas')
@UseGuards(JwtAuthGuard)
findMinhas(@Request() req) {
  console.log('user recebido:', req.user); // 👈 Veja o que chega aqui

  const userId = Number(req.user?.id);
  if (isNaN(userId)) throw new UnauthorizedException('Usuário inválido');

  return this.vagasService.findMinhas(userId);
}


@Get(':id')
findOne(@Param('id') id: string) {
    return this.vagasService.findOne(+id);
  }

@UseGuards(JwtAuthGuard)
@Patch(':id')
update(@Param('id') id: string, @Body() dto: UpdateVagasDto, @Request() req) {
  return this.vagasService.update(+id, dto, req.user);
}

@UseGuards(JwtAuthGuard)
@Delete(':id')
remove(@Param('id') id: string, @Request() req) {
  return this.vagasService.remove(+id, req.user);
}

@UseGuards(JwtAuthGuard)
@Get(':id/candidatos')
async listarCandidatos(@Param('id', ParseIntPipe) id: number, @Request() req) {
  return this.vagasService.listarCandidatosDaVaga(id, req.user);
}

}
