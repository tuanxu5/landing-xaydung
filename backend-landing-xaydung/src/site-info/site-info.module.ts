import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteInfoController } from './site-info.controller';
import { SiteInfoService } from './site-info.service';
import { TeamMember, TeamMemberSchema, Certificate, CertificateSchema, FAQ, FAQSchema, Brand, BrandSchema, ContactInfo, ContactInfoSchema } from './schemas';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TeamMember.name, schema: TeamMemberSchema },
      { name: Certificate.name, schema: CertificateSchema },
      { name: FAQ.name, schema: FAQSchema },
      { name: Brand.name, schema: BrandSchema },
      { name: ContactInfo.name, schema: ContactInfoSchema },
    ]),
    AuthModule,
  ],
  controllers: [SiteInfoController],
  providers: [SiteInfoService],
  exports: [SiteInfoService],
})
export class SiteInfoModule {}
