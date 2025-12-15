// src/common/filters/prisma-client-exception/prisma-client-exception.filter.ts

import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;

        // 解析唯一约束字段
        const target = (exception.meta as any)?.target as string[] | undefined;

        if (target?.includes('email')) {
          message = 'Email already exists';
        } else if (target?.includes('username')) {
          message = 'Username already exists';
        } else {
          message = 'Unique constraint violation';
        }
        break;
      }

      default:
        return super.catch(exception, host);
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
