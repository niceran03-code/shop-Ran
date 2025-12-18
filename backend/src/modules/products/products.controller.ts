// backend/src/modules/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProductService } from './products.service';
// 注意：文件名已改为 products.*，类名保持 Product* 不影响 NestJS 行为
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { ProductEntity } from './entities/products.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

// 商品控制器：ADMIN 专用，支持 CRUD、回收站、批量操作与状态切换
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('products')
@ApiBearerAuth()
@ApiTags('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ----------------------
  // CREATE
  // ----------------------
  @Post()
  @ApiCreatedResponse({ type: ProductEntity })
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: any,
  ) {
    const product = await this.productService.create({
      ...createProductDto,
      userId: user.id,
    });

    return new ProductEntity(product);
  }

  // ----------------------
  // GET ALL
  // ----------------------
  @Get()
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  async findAll(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('name') name?: string,
    @Query('categoryId') categoryId?: number,
    @Query('isActive') isActive?: string,
    @Query('userId') userId?: number,
    @Query('userName') userName?: string,
  ) {
    return this.productService.findWithPagination({
      page: Number(page),
      pageSize: Number(pageSize),
      name,
      categoryId: categoryId ? Number(categoryId) : undefined,
      isActive: isActive === undefined ? undefined : isActive === 'true',
      userId: userId ? Number(userId) : undefined,
      userName,
    });
  }

  // ----------------------
  // GET INACTIVE
  // ----------------------
  @Get('inactive')
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  async findInactive() {
    const products = await this.productService.findInactive();
    return products.map((p) => new ProductEntity(p));
  }

  // ----------------------
  // UPDATE
  // ----------------------
  @Patch(':id')
  @ApiOkResponse({ type: ProductEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productService.update(id, updateProductDto);
    return new ProductEntity(product);
  }

  // ----------------------
  // DELETE
  // ----------------------
  // ================================
  // 软删除：把商品丢进回收站（设置 deletedAt）
  // ================================
  @Delete(':id')
  @ApiOkResponse({ type: ProductEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.softDelete(id); // 调用 softDelete，而不是 delete
  }

  // ================================
  //回收站：获取所有已删除商品
  // GET /product/deleted
  // ================================
  @Get('deleted')
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  findDeleted() {
    // 返回 deletedAt 不为 null 的商品
    return this.productService.findDeleted();
  }

  // ================================
  //  恢复商品：从回收站恢复
  // PATCH /products/:id/restore
  // ================================
  @Patch(':id/restore')
  @ApiOkResponse({ type: ProductEntity })
  restore(@Param('id', ParseIntPipe) id: number) {
    // 恢复商品（deletedAt = null，isActive = true）
    return this.productService.restore(id);
  }

  // ================================
  // DELETE /product/force/:id
  // ================================
  @Delete('force/:id')
  @ApiOkResponse({ type: ProductEntity })
  forceDelete(@Param('id', ParseIntPipe) id: number) {
    //  新增：真正 delete
    return this.productService.forceDelete(id);
  }

  // ================================
  // 切换商品上架 / 下架状态
  // PATCH /product/:id/status
  // ================================
  @Patch(':id/status')
  @ApiOkResponse({ type: ProductEntity })
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.toggleStatus(id);
    return new ProductEntity(product);
  }

  // ================================
  // Batch Operations
  // ================================

  @Post('batch/delete')
  @ApiOkResponse()
  batchDelete(@Body('ids') ids: number[]) {
    return this.productService.batchSoftDelete(ids);
  }

  @Post('batch/status')
  @ApiOkResponse()
  batchUpdateStatus(
    @Body('ids') ids: number[],
    @Body('isActive') isActive: boolean,
  ) {
    return this.productService.batchUpdateStatus(ids, isActive);
  }

  @Post('batch/restore')
  @ApiOkResponse()
  batchRestore(@Body('ids') ids: number[]) {
    return this.productService.batchRestore(ids);
  }

  @Post('batch/force-delete')
  @ApiOkResponse()
  batchForceDelete(@Body('ids') ids: number[]) {
    return this.productService.batchForceDelete(ids);
  }
  // ----------------------
  // GET ONE BY ID
  // ----------------------
  @Get(':id')
  @ApiOkResponse({ type: ProductEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} does not exist.`);
    }

    return new ProductEntity(product);
  }
}
