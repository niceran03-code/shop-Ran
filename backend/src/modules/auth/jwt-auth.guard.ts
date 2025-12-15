// src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JWT 守卫：委托 passport-jwt 校验 Authorization Bearer
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
