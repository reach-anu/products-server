// src/mongoose-config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private config: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const uri = this.config.get<string>('MONGO_URL');
    return {
      uri,
    };
  }
}

