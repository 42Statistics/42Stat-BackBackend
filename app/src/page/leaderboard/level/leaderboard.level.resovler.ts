import { Args, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PaginationIndexArgs } from 'src/pagination/index/dto/pagination.index.dto.args';
import { LeaderboardElement } from '../models/leaderboard.model';
import { LeaderboardLevelService } from './leaderboard.level.service';
import { LeaderboardLevel } from './models/leaderboard.level.model';

@Resolver((_of: unknown) => LeaderboardLevel)
export class LeaderboardLevelResolver {
  constructor(private leaderboardLevelService: LeaderboardLevelService) {}

  @Query((_returns) => LeaderboardLevel)
  async getLeaderboardLevel() {
    return {};
  }

  @ResolveField((_returns) => LeaderboardElement)
  async total(
    @Args() paginationIndexArgs: PaginationIndexArgs,
  ): Promise<LeaderboardElement> {
    return await this.leaderboardLevelService.ranking(
      99947,
      3000, //todo: limit
      paginationIndexArgs,
    );
  }
}
