import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getPerfil(@Req() req: any) {
    const userId = req.user.id;
    return this.usersService.findOne(userId);
}

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@Req() req: any, @Body() body: { name: string; email: string }) {
    const userId = req.user.id;
    return this.usersService.updateUserProfile(userId, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }  

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async excluirMinhaConta(@Req() req: any) {
    const userId = req.user.id;
    return this.usersService.removerUsuarioComTudo(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  

}

