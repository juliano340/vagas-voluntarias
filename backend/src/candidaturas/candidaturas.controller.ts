import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CandidaturasService } from './candidaturas.service';
import { CreateCandidaturaDto } from './dto/create-candidatura.dto';
import { UpdateCandidaturaDto } from './dto/update-candidatura.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RequestWithUser } from '../auth/types/RequestWithUser'; // ajuste o caminho


@Controller('candidaturas')
export class CandidaturasController {
  constructor(private readonly candidaturasService: CandidaturasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCandidaturaDto: CreateCandidaturaDto, @Req() req: any) {
    const userId = req.user.id;
    console.log(req.user) // ← ID do usuário autenticado via JWT
    return this.candidaturasService.create(userId, createCandidaturaDto);
  }

  @Get()
  findAll() {
    return this.candidaturasService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('minhas')
  async findMinhas(@Req() req: any) {
    const usuarioId = req.user.sub;
    return this.candidaturasService.findVagasDoUsuario(usuarioId);
}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.candidaturasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCandidaturaDto: UpdateCandidaturaDto,
  ) {
    return this.candidaturasService.update(id, updateCandidaturaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.candidaturasService.remove(id);
  }

  
}
