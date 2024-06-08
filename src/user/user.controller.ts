import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Prisma, User as UserModel } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() userData: Prisma.UserCreateInput): Promise<string> {
    try {
      const message = await this.userService.createUser(userData);
      return message;
    } catch (error) {
      throw new HttpException(
        'Erro ao criar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    try {
      const user = await this.userService.getUserById({ id: Number(id) });
      if (!user) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        'Erro ao buscar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateUserById(
    @Body() userData: Prisma.UserUpdateInput,
    @Param('id') id: string,
  ): Promise<string> {
    try {
      const message = await this.userService.updateUserById(
        Number(id),
        userData,
        {
          where: { id: Number(id) },
          data: userData,
        },
      );
      return message;
    } catch (error) {
      throw new HttpException(
        'Erro ao atualizar usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: string): Promise<string> {
    try {
      const message = await this.userService.deleteUserById({ id: Number(id) });
      return message;
    } catch (error) {
      throw new HttpException(
        'Erro ao excluir usuário',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
