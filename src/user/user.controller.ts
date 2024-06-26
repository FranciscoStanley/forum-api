import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Prisma, User as UserModel } from '@prisma/client';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() userData: Prisma.UserCreateInput): Promise<string> {
    try {
      const res = await this.userService.createUser(userData);
      return res;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    try {
      const user = await this.userService.getUserById({ id: Number(id) });
      if (!user) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUserById(
    @Body() userData: Prisma.UserUpdateInput,
    @Param('id') id: string,
  ): Promise<string> {
    try {
      const res = await this.userService.updateUserById(Number(id), userData, {
        where: { id: Number(id) },
        data: userData,
      });
      return res;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUserById(@Param('id') id: string): Promise<string> {
    try {
      const res = await this.userService.deleteUserById({ id: Number(id) });
      return res;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
