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
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ----------------------
  // CREATE
  // ----------------------
  @Post()
  @ApiCreatedResponse({ type: ProductEntity })
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return new ProductEntity(product);
  }

  // ----------------------
  // GET ALL
  // ----------------------
  @Get()
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  async findAll() {
    const products = await this.productService.findAll();
    return products.map((p) => new ProductEntity(p));
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
  @Delete(':id')
  @ApiOkResponse({ type: ProductEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.remove(id);
    return new ProductEntity(product);
  }
}
