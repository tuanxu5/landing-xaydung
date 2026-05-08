import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactMessage, ContactMessageDocument } from './schemas';
import { CreateContactMessageDto, UpdateContactMessageDto } from './dto';

@Injectable()
export class ContactMessagesService {
  constructor(
    @InjectModel(ContactMessage.name) private contactMessageModel: Model<ContactMessageDocument>,
  ) {}

  async create(dto: CreateContactMessageDto): Promise<ContactMessage> {
    const message = new this.contactMessageModel(dto);
    return message.save();
  }

  async findAll(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<{ data: ContactMessage[]; total: number; page: number; limit: number }> {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (params?.status) {
      query.status = params.status;
    }

    if (params?.search) {
      query.$or = [
        { fullName: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } },
        { phone: { $regex: params.search, $options: 'i' } },
        { subject: { $regex: params.search, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.contactMessageModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.contactMessageModel.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<ContactMessage> {
    const message = await this.contactMessageModel.findById(id).exec();
    if (!message) throw new NotFoundException(`Contact message with ID ${id} not found`);
    return message;
  }

  async update(id: string, dto: UpdateContactMessageDto): Promise<ContactMessage> {
    const message = await this.contactMessageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!message) throw new NotFoundException(`Contact message with ID ${id} not found`);
    return message;
  }

  async delete(id: string): Promise<void> {
    const result = await this.contactMessageModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Contact message with ID ${id} not found`);
  }

  async getStats(): Promise<{
    total: number;
    pending: number;
    read: number;
    replied: number;
    archived: number;
  }> {
    const [total, pending, read, replied, archived] = await Promise.all([
      this.contactMessageModel.countDocuments().exec(),
      this.contactMessageModel.countDocuments({ status: 'pending' }).exec(),
      this.contactMessageModel.countDocuments({ status: 'read' }).exec(),
      this.contactMessageModel.countDocuments({ status: 'replied' }).exec(),
      this.contactMessageModel.countDocuments({ status: 'archived' }).exec(),
    ]);

    return { total, pending, read, replied, archived };
  }
}
