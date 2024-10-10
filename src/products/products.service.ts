import { Injectable, Logger } from '@nestjs/common';
import { Product } from './schema/products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(productData): Promise<Product> {
    this.logger.log('Creating a new product');
    const product = new this.productModel(productData);
    const savedProduct = await product.save();
    this.logger.log(`Product created: ${savedProduct._id}`);
    return savedProduct;
  }

  async findAll(): Promise<Product[]> {
    this.logger.log('Fetching all products');
    const products = await this.productModel.find().sort({ createdAt: -1 });;
    this.logger.log(`Found ${products.length} products`);
    return products;
  }

  async findOne(id: string): Promise<Product> {
    this.logger.log(`Fetching product with ID: ${id}`);
    const product = await this.productModel.findById(id);
    if (!product) {
      this.logger.warn(`Product with ID: ${id} not found`);
    } else {
      this.logger.log(`Found product: ${product._id}`);
    }
    return product;
  }

  async update(id: string, productData): Promise<Product> {
    this.logger.log(`Updating product with ID: ${id}`);
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      productData,
      { new: true },
    );

    if (updatedProduct) {
      this.logger.log(`Product updated: ${updatedProduct._id}`);
    } else {
      this.logger.warn(`Product with ID: ${id} not found for update`);
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<Product> {
    this.logger.log(`Removing product with ID: ${id}`);
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();

    if (deletedProduct) {
      this.logger.log(`Product removed: ${deletedProduct._id}`);
    } else {
      this.logger.warn(`Product with ID: ${id} not found for deletion`);
    }

    return deletedProduct;
  }
}
