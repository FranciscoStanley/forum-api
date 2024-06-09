import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(params: {
    email: string;
    password: string;
  }): Promise<Omit<User, 'password'> | { access_token: string }> {
    try {
      const emailExists = await this.prisma.user.findUnique({
        where: {
          email: params.email,
        },
      });

      if (!emailExists) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      const passwordMatch = await bcrypt.compare(
        params.password,
        emailExists.password,
      );

      if (!passwordMatch) {
        throw new UnauthorizedException('Senha incorreta!');
      }

      const payload = { sub: emailExists.id };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new Error(`Erro ao efetuar login: ${error.message}`);
    }
  }
}
