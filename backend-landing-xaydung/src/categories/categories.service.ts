import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = new this.categoryModel(createCategoryDto);
      return await category.save();
    } catch (error) {
      // Handle duplicate key error (unique constraint violation)
      if (error.code === 11000) {
        throw new BadRequestException('Slug đã tồn tại. Vui lòng sử dụng tên khác.');
      }
      throw error;
    }
  }

  async findAll(query?: {
    parent?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ categories: Category[]; totalPages: number; currentPage: number; total: number }> {
    const { parent, isActive, page = 1, limit = 10, search } = query || {};
    
    const filter: any = {};
    
    if (parent !== undefined) {
      filter.parent = parent === 'null' ? null : parent;
    }
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await this.categoryModel.countDocuments(filter);
    const categories = await this.categoryModel
      .find(filter)
      .populate('parent')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      categories,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel
      .findById(id)
      .populate('parent')
      .exec();
    
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID ${id}`);
    }
    
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryModel
      .findOne({ slug })
      .populate('parent')
      .exec();
    
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với slug ${slug}`);
    }
    
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    // Check if trying to set parent to itself
    const parent = updateCategoryDto.parent;
    if (parent === id) {
      throw new BadRequestException('Danh mục không thể là cha của chính nó');
    }

    try {
      const category = await this.categoryModel
        .findByIdAndUpdate(id, updateCategoryDto, { new: true })
        .populate('parent')
        .exec();
      
      if (!category) {
        throw new NotFoundException(`Không tìm thấy danh mục với ID ${id}`);
      }
      
      return category;
    } catch (error) {
      // Handle duplicate key error (unique constraint violation)
      if (error.code === 11000) {
        throw new BadRequestException('Slug đã tồn tại. Vui lòng sử dụng tên khác.');
      }
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    // Check if category has children
    const hasChildren = await this.categoryModel.exists({ parent: id });
    if (hasChildren) {
      throw new BadRequestException('Không thể xóa danh mục có danh mục con');
    }

    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID ${id}`);
    }
  }

  async getTree(): Promise<any[]> {
    const categories = await this.categoryModel
      .find({ isActive: true })
      .sort({ order: 1, name: 1 })
      .exec();

    const buildTree = (parentId: any = null): any[] => {
      return categories
        .filter(cat => {
          if (parentId === null) return !cat.parent;
          return cat.parent?.toString() === parentId.toString();
        })
        .map(cat => ({
          ...cat.toObject(),
          children: buildTree(cat._id),
        }));
    };

    return buildTree();
  }
}
