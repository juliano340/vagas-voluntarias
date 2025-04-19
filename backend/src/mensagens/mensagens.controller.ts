import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { MensagensService } from './mensagens.service';
import { CreateMensagemDto } from './dto/create-mensagen.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('mensagens')
export class MensagensController {
  constructor(private readonly mensagensService: MensagensService) {}

  @UseGuards(JwtAuthGuard)
@Post()
create(@Body() dto: CreateMensagemDto, @Req() req: any) {
  const remetenteId = req.user.id;
  return this.mensagensService.create(remetenteId, dto);
}

@UseGuards(JwtAuthGuard)
@Get('minhas')
findMinhasConversas(@Req() req: any) {
  const usuarioId = req.user.id;
  return this.mensagensService.listarConversasPorUsuario(usuarioId);
}

  @UseGuards(JwtAuthGuard)
  @Get('conversa/:vagaId/:usuarioId')
  findConversa(
    @Param('vagaId', ParseIntPipe) vagaId: number,
    @Param('usuarioId', ParseIntPipe) outroUsuarioId: number,
    @Req() req: any,
  ) {
    const usuarioLogadoId = req.user.id;
    return this.mensagensService.findConversaEntreUsuarios(vagaId, usuarioLogadoId, outroUsuarioId);
  }
}
