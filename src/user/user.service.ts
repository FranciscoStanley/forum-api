import { Inject, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: userWhereUniqueInput,
      });

      if (!user) {
        return null;
      }

      const { password, ...safeUser } = user;

      return safeUser as User;
    } catch (error) {
      throw new Error(`Não foi possível buscar o usuário: ${error.message}`);
    }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<string> {
    try {
      const existingEmail = await this.prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (existingEmail) {
        throw new Error('Este e-mail já está em uso.');
      }

      const saltOrRounds = 10;
      const hashPassword = await bcrypt.hash(data.password, saltOrRounds);
      await this.prisma.user.create({
        data: {
          ...data,
          password: hashPassword,
        },
      });
      
      return 'Usuário criado com sucesso.';
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  async updateUserById(
    id: number,
    userData: Prisma.UserUpdateInput,
    params: {
      where: Prisma.UserWhereUniqueInput;
      data: Prisma.UserUpdateInput;
    },
  ): Promise<string> {
    const { where, data } = params;

    try {
      if (typeof data.password === 'string') {
        const saltOrRounds = 10;
        const hashPassword = await bcrypt.hash(data.password, saltOrRounds);
        data.password = hashPassword;
      }

      const user = await this.prisma.user.update({
        data,
        where,
      });

      if (!user) {
        return null;
      }

      return 'Usuário atualizado com sucesso.';
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  async deleteUserById(where: Prisma.UserWhereUniqueInput): Promise<string> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where,
      });

      if (!existingUser) {
        throw new Error('Usuário não encontrado.');
      }

      await this.prisma.user.delete({
        where,
      });

      return 'Usuário deletado com sucesso.';
    } catch (error) {
      throw new Error(`Erro ao excluir usuário: ${error.message}`);
    }
  }
}
