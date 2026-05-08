import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RecruitmentsService } from './recruitments.service';
import { CreateRecruitmentDto, UpdateRecruitmentDto, CreateApplicationDto, UpdateApplicationDto } from './dto';
import { AuthGuard } from '../auth/guards';

@Controller('api/recruitments')
export class RecruitmentsController {
  constructor(private readonly recruitmentsService: RecruitmentsService) {}

  // Recruitment endpoints
  @Post()
  @UseGuards(AuthGuard)
  async createRecruitment(@Body() createRecruitmentDto: CreateRecruitmentDto) {
    return this.recruitmentsService.createRecruitment(createRecruitmentDto);
  }

  @Get()
  async findAllRecruitments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const isActiveValue = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
    
    return this.recruitmentsService.findAllRecruitments(pageNum, limitNum, search, isActiveValue);
  }

  @Get(':id')
  async findRecruitmentById(@Param('id') id: string) {
    return this.recruitmentsService.findRecruitmentById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateRecruitment(
    @Param('id') id: string,
    @Body() updateRecruitmentDto: UpdateRecruitmentDto,
  ) {
    return this.recruitmentsService.updateRecruitment(id, updateRecruitmentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRecruitment(@Param('id') id: string) {
    await this.recruitmentsService.deleteRecruitment(id);
  }

  // Application endpoints
  @Post('applications')
  async createApplication(@Body() createApplicationDto: CreateApplicationDto) {
    return this.recruitmentsService.createApplication(createApplicationDto);
  }

  @Get(':recruitmentId/applications')
  @UseGuards(AuthGuard)
  async findApplicationsByRecruitment(
    @Param('recruitmentId') recruitmentId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    
    return this.recruitmentsService.findApplicationsByRecruitment(recruitmentId, pageNum, limitNum, status);
  }

  @Get('applications/:id')
  @UseGuards(AuthGuard)
  async findApplicationById(@Param('id') id: string) {
    return this.recruitmentsService.findApplicationById(id);
  }

  @Put('applications/:id')
  @UseGuards(AuthGuard)
  async updateApplication(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.recruitmentsService.updateApplication(id, updateApplicationDto);
  }

  @Delete('applications/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteApplication(@Param('id') id: string) {
    await this.recruitmentsService.deleteApplication(id);
  }
}
