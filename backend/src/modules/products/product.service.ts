// src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateProductDto & { userId: number }) {
    return this.prisma.product.create({
      data,
    });
  }
  async findAll(params?: {
    userId?: number;
    userName?: string;
    isActive?: boolean;
  }) {
    const where: any = {
      deletedAt: null,
    };

    if (params?.userId) {
      where.userId = params.userId;
    }

    if (params?.userName) {
      where.user = {
        username: {
          contains: params.userName,
          mode: 'insensitive',
        },
      };
    }

    if (params?.isActive !== undefined) {
      where.isActive = params.isActive;
    }

    return this.prisma.product.findMany({
      where,
      include: {
        user: true,
        category: true,
      },
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async toggleStatus(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        isActive: !product.isActive,
      },
    });
  }

  findInactive() {
    return this.prisma.product.findMany({
      where: { isActive: false },
    });
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async softDelete(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  async findDeleted() {
    return this.prisma.product.findMany({
      where: { deletedAt: { not: null } },
    });
  }

  async restore(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: null, isActive: true },
    });
  }

  async forceDelete(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async search(params: {
    id?: number;
    name?: string;
    categoryId?: number;
    subCategoryId?: number;
  }) {
    const where: any = {};

    if (params.id) where.id = params.id;

    if (params.name)
      where.name = { contains: params.name, mode: 'insensitive' };

    if (params.categoryId) where.categoryId = params.categoryId;

    if (params.subCategoryId)
      where.category = { parentId: params.subCategoryId };

    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
        user: true,
      },
    });
  }

  async findWithPagination(params: {
    page: number;
    pageSize: number;
    name?: string;
    categoryId?: number;
    isActive?: boolean;
    userId?: number;
    userName?: string;
  }) {
    const { page, pageSize, name, categoryId, isActive, userId, userName } =
      params;

    const where: any = {
      deletedAt: null,
    };

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (userId) {
      where.userId = userId;
    }

    if (userName) {
      where.user = {
        username: {
          contains: userName,
          mode: 'insensitive',
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          category: true,
          user: true,
        },
        orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      pageSize,
    };
  }
}
