import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMember, TeamMemberDocument, Certificate, CertificateDocument, FAQ, FAQDocument, Brand, BrandDocument, ContactInfo } from './schemas';
import { CreateTeamMemberDto, UpdateTeamMemberDto, CreateCertificateDto, UpdateCertificateDto, CreateFAQDto, UpdateFAQDto, CreateBrandDto, UpdateBrandDto } from './dto';
import { UpdateContactInfoDto } from './dto/contact-info.dto';

@Injectable()
export class SiteInfoService {
  constructor(
    @InjectModel(TeamMember.name) private teamMemberModel: Model<TeamMemberDocument>,
    @InjectModel(Certificate.name) private certificateModel: Model<CertificateDocument>,
    @InjectModel(FAQ.name) private faqModel: Model<FAQDocument>,
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
    @InjectModel(ContactInfo.name) private contactInfoModel: Model<ContactInfo>,
  ) {}

  // Team Members
  async createTeamMember(dto: CreateTeamMemberDto): Promise<TeamMember> {
    const member = new this.teamMemberModel(dto);
    return member.save();
  }

  async findAllTeamMembers(isActive?: boolean): Promise<TeamMember[]> {
    const query = isActive !== undefined ? { isActive } : {};
    return this.teamMemberModel.find(query).sort({ order: 1, createdAt: -1 }).exec();
  }

  async findTeamMemberById(id: string): Promise<TeamMember> {
    const member = await this.teamMemberModel.findById(id).exec();
    if (!member) throw new NotFoundException(`Team member with ID ${id} not found`);
    return member;
  }

  async updateTeamMember(id: string, dto: UpdateTeamMemberDto): Promise<TeamMember> {
    const member = await this.teamMemberModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!member) throw new NotFoundException(`Team member with ID ${id} not found`);
    return member;
  }

  async deleteTeamMember(id: string): Promise<void> {
    const result = await this.teamMemberModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Team member with ID ${id} not found`);
  }

  // Certificates
  async createCertificate(dto: CreateCertificateDto): Promise<Certificate> {
    const cert = new this.certificateModel(dto);
    return cert.save();
  }

  async findAllCertificates(isActive?: boolean): Promise<Certificate[]> {
    const query = isActive !== undefined ? { isActive } : {};
    return this.certificateModel.find(query).sort({ order: 1, createdAt: -1 }).exec();
  }

  async findCertificateById(id: string): Promise<Certificate> {
    const cert = await this.certificateModel.findById(id).exec();
    if (!cert) throw new NotFoundException(`Certificate with ID ${id} not found`);
    return cert;
  }

  async updateCertificate(id: string, dto: UpdateCertificateDto): Promise<Certificate> {
    const cert = await this.certificateModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!cert) throw new NotFoundException(`Certificate with ID ${id} not found`);
    return cert;
  }

  async deleteCertificate(id: string): Promise<void> {
    const result = await this.certificateModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Certificate with ID ${id} not found`);
  }

  // FAQs
  async createFAQ(dto: CreateFAQDto): Promise<FAQ> {
    const faq = new this.faqModel(dto);
    return faq.save();
  }

  async findAllFAQs(isActive?: boolean): Promise<FAQ[]> {
    const query = isActive !== undefined ? { isActive } : {};
    return this.faqModel.find(query).sort({ order: 1, createdAt: -1 }).exec();
  }

  async findFAQById(id: string): Promise<FAQ> {
    const faq = await this.faqModel.findById(id).exec();
    if (!faq) throw new NotFoundException(`FAQ with ID ${id} not found`);
    return faq;
  }

  async updateFAQ(id: string, dto: UpdateFAQDto): Promise<FAQ> {
    const faq = await this.faqModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!faq) throw new NotFoundException(`FAQ with ID ${id} not found`);
    return faq;
  }

  async deleteFAQ(id: string): Promise<void> {
    const result = await this.faqModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`FAQ with ID ${id} not found`);
  }

  // Brands
  async createBrand(dto: CreateBrandDto): Promise<Brand> {
    const brand = new this.brandModel(dto);
    return brand.save();
  }

  async findAllBrands(isActive?: boolean): Promise<Brand[]> {
    const query = isActive !== undefined ? { isActive } : {};
    return this.brandModel.find(query).sort({ order: 1, createdAt: -1 }).exec();
  }

  async findBrandById(id: string): Promise<Brand> {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) throw new NotFoundException(`Brand with ID ${id} not found`);
    return brand;
  }

  async updateBrand(id: string, dto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!brand) throw new NotFoundException(`Brand with ID ${id} not found`);
    return brand;
  }

  async deleteBrand(id: string): Promise<void> {
    const result = await this.brandModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Brand with ID ${id} not found`);
  }

  // Contact Info (Singleton)
  async getContactInfo(): Promise<ContactInfo> {
    let info = await this.contactInfoModel.findOne().exec();
    if (!info) {
      // Create default contact info if not exists
      info = new this.contactInfoModel({
        companyName: 'Công ty Vật liệu Xây dựng',
        address: 'Địa chỉ công ty',
        phone: '0123456789',
        email: 'contact@example.com',
        website: 'https://example.com',
        workingHours: 'Thứ 2 - Thứ 6: 8:00 - 17:00',
      });
      await info.save();
    }
    return info;
  }

  async updateContactInfo(dto: UpdateContactInfoDto): Promise<ContactInfo> {
    let info = await this.contactInfoModel.findOne().exec();
    if (!info) {
      info = new this.contactInfoModel(dto);
      return info.save();
    }
    const updated = await this.contactInfoModel.findByIdAndUpdate(info._id, dto, { new: true }).exec();
    if (!updated) {
      throw new NotFoundException('Contact info not found');
    }
    return updated;
  }
}
