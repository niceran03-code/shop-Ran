// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
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

  // -----------------------------
  // UTIL: Generate Refresh Token
  // -----------------------------
  private generateRefreshToken(userId: number) {
    return this.jwtService.sign(
      { userId },
      { expiresIn: '7d' }, // refresh token: 7 days
    );
  }

  // -----------------------------
  // LOGIN
  // -----------------------------
  async login(email: string, password: string): Promise<AuthEntity> {
    // 1️⃣ 查找用户
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // 2️⃣ 账号或密码错误 → 401
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3️⃣ 权限不足 → 403
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Your account does not have permission to access the admin system',
      );
    }

    // 4️⃣ 生成 Token
    const accessToken = this.jwtService.sign({ userId: user.id });
    const refreshToken = this.generateRefreshToken(user.id);

    // 5️⃣ 保存 refreshToken
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // 6️⃣ 返回登录结果
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  // -----------------------------
  // REGISTER
  // -----------------------------
  async register(dto: RegisterDto) {
    // 1️⃣ 邮箱唯一性校验
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('Email already exists');
    }

    // 2️⃣ 加密密码
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3️⃣ 创建用户（默认 USER）
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
        role: 'USER',
      },
    });

    // ✅ 后台系统：注册不返回 token
    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  // -----------------------------
  // REFRESH TOKEN
  // -----------------------------
  async refresh(refreshToken: string): Promise<AuthEntity> {
    try {
      // 1️⃣ 校验 refreshToken
      const payload = this.jwtService.verify(refreshToken);

      // 2️⃣ 查询用户
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });

      // 3️⃣ 校验 refreshToken 是否一致
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 4️⃣ 生成新的 accessToken
      const newAccessToken = this.jwtService.sign({ userId: user.id });

      return {
        accessToken: newAccessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      };
    } catch {
      throw new UnauthorizedException('Expired or invalid refresh token');
    }
  }
}
