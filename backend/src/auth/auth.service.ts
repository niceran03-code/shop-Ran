// src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // -----------------------------
  // LOGIN
  // -----------------------------
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const accessToken = this.jwtService.sign({ userId: user.id });

    // 过滤掉 password，防止泄漏
    const { password: _, ...safeUser } = user;

    return {
      accessToken,
      user: safeUser,
    };
  }

  // -----------------------------
  // REGISTER
  // -----------------------------
  async register(email: string, username: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const accessToken = this.jwtService.sign({ userId: newUser.id });

    // 过滤 password
    const { password: _, ...safeUser } = newUser;

    return {
      accessToken,
      user: safeUser,
    };
  }
}
