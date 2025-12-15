import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUserPayload {
  userId: number;
  email?: string;
  role?: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
