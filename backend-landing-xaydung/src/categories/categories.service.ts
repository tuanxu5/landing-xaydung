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
    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findAll(query?: {
    parent?: string;
    isActive?: boolean;
  }): Promise<Category[]> {
    const { parent, isActive } = query || {};
    
    const filter: any = {};
    
    if (parent !== undefined) {
      filter.parent = parent === 'null' ? null : parent;
    }
    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    return this.categoryModel
      .find(filter)
      .populate('parent')
      .sort({ order: 1, name: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel
      .findById(id)
      .populate('parent')
      .exec();
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryModel
      .findOne({ slug })
      .populate('parent')
      .exec();
    
    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }
    
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    // Check if trying to set parent to itself
    const parent = updateCategoryDto.parent;
    if (parent === id) {
      throw new BadRequestException('Category cannot be its own parent');
    }

    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .populate('parent')
      .exec();
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return category;
  }

  async remove(id: string): Promise<void> {
    // Check if category has children
    const hasChildren = await this.categoryModel.exists({ parent: id });
    if (hasChildren) {
      throw new BadRequestException('Cannot delete category with subcategories');
    }

    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
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
