// src/category/category.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: {
          name: dto.name,
          parentId: dto.parentId ?? null,
        },
      });
    } catch (error: any) {
      // Prisma unique constraint error code = P2002
      if (error.code === 'P2002') {
        throw new ConflictException('Category name already exists');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.category.findMany({
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async findTree() {
    const categories = await this.prisma.category.findMany({
      orderBy: { id: 'asc' },
    });

    const map = new Map<number, any>();
    categories.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    const tree: any[] = [];

    map.forEach((cat) => {
      if (cat.parentId) {
        const parent = map.get(cat.parentId);
        if (parent) {
          parent.children.push(cat);
        }
      } else {
        tree.push(cat);
      }
    });

    return tree;
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        parentId: dto.parentId ?? null,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }

  async getPaginatedTree(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    // 1) 取顶级分类
    const [items, total] = await Promise.all([
      this.prisma.category.findMany({
        where: { parentId: null },
        include: { children: true },
        skip,
        take: pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.category.count({
        where: { parentId: null },
      }),
    ]);

    return {
      data: items,
      total,
    };
  }
}
