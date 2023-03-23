import { Module } from '@nestjs/common';
import { PersonalGeneralResolver } from './personal.general.resolver';
import { PersonalGeneralService } from './personal.general.service';

@Module({
  imports: [],
  providers: [PersonalGeneralResolver, PersonalGeneralService],
})
export class PersonalGeneralModule {}
