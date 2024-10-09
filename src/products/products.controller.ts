import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Logger,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './schema/products.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('/products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  //add a new product
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() productData): Promise<Product> {
    try {
      this.logger.log(`Product Data: ${JSON.stringify(productData)}`);
      const { name, price, stock, description } = productData;
      if (!name || !price || !stock || !description) {
        throw new HttpException('All fields are required', 400);
      }
      return await this.productsService.create(productData);
    } catch (error) {
      this.logger.error('Error creating product', error);
      throw new HttpException(
        error.getResponse() || 'Failed to create product',
        error.getStatus() || 500,
      );
    }
  }

  //list all products
  @Get()
  async findAll(): Promise<Product[]> {
    try {
      return await this.productsService.findAll();
    } catch (error) {
      this.logger.error('Error fetching products', error);
      throw new HttpException('Failed to fetch products', 500);
    }
  }

  //get product
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    try {
      this.logger.log(`product id: ${id}`);
      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new HttpException('Product not found', 404);
      }
      return product;
    } catch (error) {
      this.logger.error('Error finding product', error);
      throw new HttpException(
        error.getResponse() || 'Failed to get product',
        error.getStatus() || 500,
      );
    }
  }

  //edit product
  @Put(':id')
  async update(@Param('id') id: string, @Body() productData): Promise<Product> {
    try {
      this.logger.log(`product id: ${id}`);
      const updatedProduct = await this.productsService.update(id, productData);
      if (!updatedProduct) {
        throw new HttpException('Product not found', 404);
      }
      return updatedProduct;
    } catch (error) {
      this.logger.error(`Error updating product with ID ${id}`, error);
      throw new HttpException(
        error.getResponse() || 'Failed to update product',
        error.getStatus() || 500,
      );
    }
  }

  //delete product
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Product> {
    try {
      this.logger.log(`Removing product with ID: ${id}`);
      const deletedProduct = await this.productsService.remove(id);
      if (!deletedProduct) {
        throw new HttpException('Product not found', 404);
      }
      return deletedProduct;
    } catch (error) {
      this.logger.error(`Error removing product with ID ${id}`, error);
      throw new HttpException(
        error.getResponse() || 'Failed to remove product',
        error.getStatus() || 500,
      );
    }
  }
}
