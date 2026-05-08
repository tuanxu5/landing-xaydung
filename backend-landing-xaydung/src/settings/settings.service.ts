import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  async getAll(): Promise<Record<string, string>> {
    const settings = await this.settingModel.find().exec();
    const result: Record<string, string> = {};
    settings.forEach((setting) => {
      result[setting.key] = setting.value;
    });
    return result;
  }

  async updateSettings(updateSettingsDto: UpdateSettingsDto): Promise<Record<string, string>> {
    const updates = Object.entries(updateSettingsDto);
    
    for (const [key, value] of updates) {
      if (value !== undefined) {
        await this.settingModel.findOneAndUpdate(
          { key },
          { key, value },
          { upsert: true, new: true },
        );
      }
    }

    return this.getAll();
  }

  async getSetting(key: string): Promise<string | null> {
    const setting = await this.settingModel.findOne({ key }).exec();
    return setting ? setting.value : null;
  }
}
