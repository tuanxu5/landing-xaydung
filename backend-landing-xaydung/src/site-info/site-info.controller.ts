import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { SiteInfoService } from './site-info.service';
import { CreateTeamMemberDto, UpdateTeamMemberDto, CreateCertificateDto, UpdateCertificateDto, CreateFAQDto, UpdateFAQDto, CreateBrandDto, UpdateBrandDto } from './dto';
import { UpdateContactInfoDto } from './dto/contact-info.dto';
import { AuthGuard } from '../auth/guards';

@Controller('api/site-info')
export class SiteInfoController {
  constructor(private readonly siteInfoService: SiteInfoService) {}

  // Team Members
  @Post('team-members')
  @UseGuards(AuthGuard)
  createTeamMember(@Body() dto: CreateTeamMemberDto) {
    return this.siteInfoService.createTeamMember(dto);
  }

  @Get('team-members')
  findAllTeamMembers(@Query('isActive') isActive?: string) {
    const isActiveValue = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.siteInfoService.findAllTeamMembers(isActiveValue);
  }

  @Get('team-members/:id')
  findTeamMemberById(@Param('id') id: string) {
    return this.siteInfoService.findTeamMemberById(id);
  }

  @Put('team-members/:id')
  @UseGuards(AuthGuard)
  updateTeamMember(@Param('id') id: string, @Body() dto: UpdateTeamMemberDto) {
    return this.siteInfoService.updateTeamMember(id, dto);
  }

  @Delete('team-members/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTeamMember(@Param('id') id: string) {
    await this.siteInfoService.deleteTeamMember(id);
  }

  // Certificates
  @Post('certificates')
  @UseGuards(AuthGuard)
  createCertificate(@Body() dto: CreateCertificateDto) {
    return this.siteInfoService.createCertificate(dto);
  }

  @Get('certificates')
  findAllCertificates(@Query('isActive') isActive?: string) {
    const isActiveValue = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.siteInfoService.findAllCertificates(isActiveValue);
  }

  @Get('certificates/:id')
  findCertificateById(@Param('id') id: string) {
    return this.siteInfoService.findCertificateById(id);
  }

  @Put('certificates/:id')
  @UseGuards(AuthGuard)
  updateCertificate(@Param('id') id: string, @Body() dto: UpdateCertificateDto) {
    return this.siteInfoService.updateCertificate(id, dto);
  }

  @Delete('certificates/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCertificate(@Param('id') id: string) {
    await this.siteInfoService.deleteCertificate(id);
  }

  // FAQs
  @Post('faqs')
  @UseGuards(AuthGuard)
  createFAQ(@Body() dto: CreateFAQDto) {
    return this.siteInfoService.createFAQ(dto);
  }

  @Get('faqs')
  findAllFAQs(@Query('isActive') isActive?: string) {
    const isActiveValue = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.siteInfoService.findAllFAQs(isActiveValue);
  }

  @Get('faqs/:id')
  findFAQById(@Param('id') id: string) {
    return this.siteInfoService.findFAQById(id);
  }

  @Put('faqs/:id')
  @UseGuards(AuthGuard)
  updateFAQ(@Param('id') id: string, @Body() dto: UpdateFAQDto) {
    return this.siteInfoService.updateFAQ(id, dto);
  }

  @Delete('faqs/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFAQ(@Param('id') id: string) {
    await this.siteInfoService.deleteFAQ(id);
  }

  // Brands
  @Post('brands')
  @UseGuards(AuthGuard)
  createBrand(@Body() dto: CreateBrandDto) {
    return this.siteInfoService.createBrand(dto);
  }

  @Get('brands')
  findAllBrands(@Query('isActive') isActive?: string) {
    const isActiveValue = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    return this.siteInfoService.findAllBrands(isActiveValue);
  }

  @Get('brands/:id')
  findBrandById(@Param('id') id: string) {
    return this.siteInfoService.findBrandById(id);
  }

  @Put('brands/:id')
  @UseGuards(AuthGuard)
  updateBrand(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.siteInfoService.updateBrand(id, dto);
  }

  @Delete('brands/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBrand(@Param('id') id: string) {
    await this.siteInfoService.deleteBrand(id);
  }

  // Contact Info
  @Get('contact')
  getContactInfo() {
    return this.siteInfoService.getContactInfo();
  }

  @Put('contact')
  @UseGuards(AuthGuard)
  updateContactInfo(@Body() dto: UpdateContactInfoDto) {
    return this.siteInfoService.updateContactInfo(dto);
  }
}
