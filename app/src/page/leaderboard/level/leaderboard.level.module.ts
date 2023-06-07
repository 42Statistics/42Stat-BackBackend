import { Module } from '@nestjs/common';
import { CursusUserModule } from 'src/api/cursusUser/cursusUser.module';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { LeaderboardUtilModule } from '../util/leaderboard.util.module';
import { LeaderboardUtilService } from '../util/leaderboard.util.service';
import { LeaderboardLevelResolver } from './leaderboard.level.resovler';
import { LeaderboardLevelService } from './leaderboard.level.service';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';

@Module({
  imports: [LeaderboardUtilModule, CursusUserModule],
  providers: [
    LeaderboardLevelResolver,
    LeaderboardLevelService,
    LeaderboardUtilService,
    CursusUserService,
    PaginationIndexService,
  ],
})
// eslint-disable-next-line
export class LeaderboardLevelModule {}
