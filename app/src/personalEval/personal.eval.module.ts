import { Module } from '@nestjs/common';
import { TimeService } from 'src/common/time.calculate';
import { PersonalGeneralModule } from 'src/personalGeneral/personal.general.module';
import { PersonalGeneralService } from 'src/personalGeneral/personal.general.service';
import { ScaleTeamsModule } from 'src/scaleTeams/scaleTeams.module';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { PersonalEvalResolver } from './personal.eval.resolver';
import { PersonalEvalService } from './personal.eval.service';

@Module({
  imports: [PersonalGeneralModule, ScaleTeamsModule],
  providers: [
    PersonalEvalResolver,
    PersonalEvalService,
    PersonalGeneralService,
    ScaleTeamsService,
    TimeService,
  ],
})
export class PersonalEvalModule {}
