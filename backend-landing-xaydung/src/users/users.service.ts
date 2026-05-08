import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if username or email already exists
    const existingUser = await this.userModel.findOne({
      $or: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      if (existingUser.username === createUserDto.username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    const user = new this.userModel({
      username: createUserDto.username,
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      phone: createUserDto.phone,
      passwordHash,
    });
    
    return user.save();
  }

  async findAll(query?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: User[]; total: number; page: number; totalPages: number }> {
    const { search, page = 1, limit = 20 } = query || {};
    
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.userModel
        .find(filter)
        .select('-passwordHash')
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
    const user = await this.userModel.findById(id).select('-passwordHash').exec();
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if username or email is being updated and already exists
    const username = updateUserDto.username;
    const email = updateUserDto.email;
    
    if (username || email) {
      const query: any = {
        _id: { $ne: id },
        $or: [],
      };

      if (username) {
        query.$or.push({ username });
      }
      if (email) {
        query.$or.push({ email });
      }

      if (query.$or.length > 0) {
        const existingUser = await this.userModel.findOne(query);

        if (existingUser) {
          if (username && existingUser.username === username) {
            throw new ConflictException('Username already exists');
          }
          if (email && existingUser.email === email) {
            throw new ConflictException('Email already exists');
          }
        }
      }
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (updateUserDto.fullName) updateData.fullName = updateUserDto.fullName;
    if (email) updateData.email = email;
    if (updateUserDto.phone !== undefined) updateData.phone = updateUserDto.phone;
    if (updateUserDto.password) {
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-passwordHash')
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
