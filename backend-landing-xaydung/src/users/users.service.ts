import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email or phone already exists
    const existingUser = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { phone: createUserDto.phone },
      ],
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.phone === createUserDto.phone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(query?: {
    role?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
    const { role, isActive, search, page = 1, limit = 20 } = query || {};
    
    const filter: any = {};
    
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if email or phone is being updated and already exists
    const email = updateUserDto.email;
    const phone = updateUserDto.phone;
    
    if (email || phone) {
      const query: any = {
        _id: { $ne: id },
        $or: [],
      };

      if (email) {
        query.$or.push({ email });
      }
      if (phone) {
        query.$or.push({ phone });
      }

      if (query.$or.length > 0) {
        const existingUser = await this.userModel.findOne(query);

        if (existingUser) {
          if (email && existingUser.email === email) {
            throw new ConflictException('Email already exists');
          }
          if (phone && existingUser.phone === phone) {
            throw new ConflictException('Phone number already exists');
          }
        }
      }
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
