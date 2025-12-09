// src/auth/auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private generateRefreshToken(userId: number) {
    return this.jwtService.sign(
      { userId },
      { expiresIn: '7d' }, // Refresh Token 一般设置 7 天
    );
  }

  // -----------------------------
  // LOGIN
  // -----------------------------
  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new NotFoundException(`No user found for email: ${email}`);

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException(
        'Only administrators may access the admin system',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');

    const accessToken = this.jwtService.sign({ userId: user.id });
    const refreshToken = this.generateRefreshToken(user.id);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }

  // -----------------------------
  // REGISTER
  // -----------------------------
  async register(dto: RegisterDto): Promise<AuthEntity> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
      },
    });

    const accessToken = this.jwtService.sign({ userId: user.id });
    const refreshToken = this.generateRefreshToken(user.id);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: 'USER',
      },
    };
  }

  // -----------------------------
  // REFRESH TOKEN
  // -----------------------------
  async refresh(refreshToken: string): Promise<AuthEntity> {
    try {
      // 1) 验证 refreshToken 签名是否有效
      const payload = this.jwtService.verify(refreshToken);

      // 2) 从数据库查询用户
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      // 3) 检查 refreshToken 是否与数据库存储一致
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 4) 创建新的 Access Token
      const newAccessToken = this.jwtService.sign({ userId: user.id });

      return {
        accessToken: newAccessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      };
    } catch {
      throw new UnauthorizedException('Expired or invalid refresh token');
    }
  }
}
