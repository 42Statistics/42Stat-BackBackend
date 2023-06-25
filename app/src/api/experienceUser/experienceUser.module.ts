import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from 'src/cache/cache.module';
import { CursusUserModule } from '../cursusUser/cursusUser.module';
import { LevelModule } from '../level/level.module';
import {
  ExperienceSchema,
  experience_user,
} from './db/experienceUser.database.schema';
import { ExperienceUserCacheService } from './experienceUser.cache.service';
import { ExperienceUserService } from './experienceUser.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: experience_user.name, schema: ExperienceSchema },
    ]),
    CursusUserModule,
    LevelModule,
    CacheModule,
  ],
  providers: [ExperienceUserService, ExperienceUserCacheService],
  exports: [
    MongooseModule,
    ExperienceUserService,
    ExperienceUserCacheService,
    CursusUserModule,
    LevelModule,
    CacheModule,
  ],
})
// eslint-diable-next-line
export class ExperienceUserModule {}
