import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recruitment, RecruitmentDocument, Application, ApplicationDocument } from './schemas';
import { CreateRecruitmentDto, UpdateRecruitmentDto, CreateApplicationDto, UpdateApplicationDto } from './dto';

@Injectable()
export class RecruitmentsService {
  constructor(
    @InjectModel(Recruitment.name) private recruitmentModel: Model<RecruitmentDocument>,
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
  ) {}

  // Recruitment CRUD
  async createRecruitment(createRecruitmentDto: CreateRecruitmentDto): Promise<Recruitment> {
    const recruitment = new this.recruitmentModel(createRecruitmentDto);
    return recruitment.save();
  }

  async findAllRecruitments(
    page: number = 1,
    limit: number = 10,
    search?: string,
    isActive?: boolean,
  ): Promise<{ data: Recruitment[]; total: number; page: number; limit: number }> {
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.recruitmentModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.recruitmentModel.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findRecruitmentById(id: string): Promise<Recruitment> {
    const recruitment = await this.recruitmentModel.findById(id).exec();
    if (!recruitment) {
      throw new NotFoundException(`Recruitment with ID ${id} not found`);
    }
    return recruitment;
  }

  async updateRecruitment(id: string, updateRecruitmentDto: UpdateRecruitmentDto): Promise<Recruitment> {
    const recruitment = await this.recruitmentModel
      .findByIdAndUpdate(id, updateRecruitmentDto, { new: true })
      .exec();
    if (!recruitment) {
      throw new NotFoundException(`Recruitment with ID ${id} not found`);
    }
    return recruitment;
  }

  async deleteRecruitment(id: string): Promise<void> {
    const result = await this.recruitmentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Recruitment with ID ${id} not found`);
    }
    // Also delete all applications for this recruitment
    await this.applicationModel.deleteMany({ recruitmentId: id }).exec();
  }

  // Application CRUD
  async createApplication(createApplicationDto: CreateApplicationDto): Promise<Application> {
    // Verify recruitment exists
    await this.findRecruitmentById(createApplicationDto.recruitmentId);
    
    const application = new this.applicationModel(createApplicationDto);
    return application.save();
  }

  async findApplicationsByRecruitment(
    recruitmentId: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<{ data: Application[]; total: number; page: number; limit: number }> {
    const query: any = { recruitmentId };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.applicationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.applicationModel.countDocuments(query).exec(),
    ]);

    return { data, total, page, limit };
  }

  async findApplicationById(id: string): Promise<Application> {
    const application = await this.applicationModel.findById(id).exec();
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    return application;
  }

  async updateApplication(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    const application = await this.applicationModel
      .findByIdAndUpdate(id, updateApplicationDto, { new: true })
      .exec();
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    return application;
  }

  async deleteApplication(id: string): Promise<void> {
    const result = await this.applicationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
  }
}
