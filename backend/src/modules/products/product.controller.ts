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

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('product')
@ApiBearerAuth()
@ApiTags('product')
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
  findAll() {
    return this.productService.findAll();
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
  // PATCH /product/restore/:id
  // ================================
  @Patch('restore/:id')
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

  @Get('search')
  async searchProducts(
    @Query('id') id?: number,
    @Query('name') name?: string,
    @Query('category') category?: number,
    @Query('subCategory') subCategory?: number,
  ) {
    return this.productService.search({
      id: id ? Number(id) : undefined,
      name,
      categoryId: category ? Number(category) : undefined,
      subCategoryId: subCategory ? Number(subCategory) : undefined,
    });
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
