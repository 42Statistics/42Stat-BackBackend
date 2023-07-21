import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { MyUserId } from 'src/auth/myContext';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import {
  DateTemplate,
  DateTemplateArgs,
  UnsupportedDateTemplate,
} from 'src/dateRange/dtos/dateRange.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { PaginationIndexArgs } from 'src/pagination/index/dtos/pagination.index.dto.args';
import { LeaderboardElementDateRanged } from '../models/leaderboard.model';
import { LeaderboardScoreService } from './leaderboard.score.service';
import { LeaderboardScore } from './models/leaderboard.score.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => LeaderboardScore)
export class LeaderboardScoreResolver {
  constructor(
    private readonly leaderboardScoreService: LeaderboardScoreService,
  ) {}

  @Query((_returns) => LeaderboardScore)
  async getLeaderboardScore() {
    return {};
  }

  @ResolveField((_returns) => LeaderboardElementDateRanged)
  async byDateTemplate(
    @MyUserId() myUserId: number,
    @Args() paginationIndexArgs: PaginationIndexArgs,
    @Args({ description: 'TOTAL, CURR_MONTH, CURR_WEEK 만 가능합니다' })
    { dateTemplate }: DateTemplateArgs,
  ) {
    if (
      !(
        dateTemplate === DateTemplate.TOTAL ||
        dateTemplate === DateTemplate.CURR_MONTH ||
        dateTemplate === DateTemplate.CURR_WEEK
      )
    ) {
      throw new UnsupportedDateTemplate();
    }

    return await this.leaderboardScoreService.rankingByDateTemplate(
      dateTemplate,
      { userId: myUserId, paginationIndexArgs },
    );
  }
}
