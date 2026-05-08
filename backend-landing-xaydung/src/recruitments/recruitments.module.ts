import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecruitmentsController } from './recruitments.controller';
import { RecruitmentsService } from './recruitments.service';
import { Recruitment, RecruitmentSchema, Application, ApplicationSchema } from './schemas';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Recruitment.name, schema: RecruitmentSchema },
      { name: Application.name, schema: ApplicationSchema },
    ]),
    AuthModule,
  ],
  controllers: [RecruitmentsController],
  providers: [RecruitmentsService],
  exports: [RecruitmentsService],
})
export class RecruitmentsModule {}
