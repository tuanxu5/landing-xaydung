import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async findAll(query?: {
    category?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    const { category, isActive, isFeatured, search, page = 1, limit = 20 } = query || {};
    
    const filter: any = {};
    
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
        .populate('category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .exec();
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productModel
      .findOne({ slug })
      .populate('category')
      .exec();
    
    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }
    
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('category')
      .exec();
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(
        id,
        { $inc: { stock: quantity } },
        { new: true }
      )
      .exec();
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }
}
