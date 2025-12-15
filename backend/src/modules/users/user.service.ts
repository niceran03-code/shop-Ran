// backend/src/modules/users/user.service.ts
import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

// 用户服务：处理创建/更新/删除并校验角色与关联约束
export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;
    return this.prisma.user.create({ data: createUserDto });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(
    targetUserId: number,
    updateUserDto: UpdateUserDto,
    currentUserId: number,
  ) {
    //  禁止修改自己的 role
    if (updateUserDto.role && targetUserId === currentUserId) {
      throw new ForbiddenException(
        'You are not allowed to change your own role',
      );
    }

    // 处理密码
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: updateUserDto,
    });
  }

  async findWithPagination(page: number, pageSize: number) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
    };
  }

  async remove(id: number) {
    const products = await this.prisma.product.findMany({
      where: { userId: id },
    });

    if (products.length > 0) {
      throw new ConflictException(
        'Cannot delete user because they have related products.',
      );
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
