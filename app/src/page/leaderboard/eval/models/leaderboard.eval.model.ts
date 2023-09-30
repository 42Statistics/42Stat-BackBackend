import { Field, ObjectType } from '@nestjs/graphql';
import { LeaderboardElementDateRanged } from '../../common/models/leaderboard.model';

@ObjectType()
export class LeaderboardEval {
  @Field({
    description: 'TOTAL, CURR_MONTH, CURR_WEEK 만 가능합니다',
  })
  byDateTemplate: LeaderboardElementDateRanged;
}
