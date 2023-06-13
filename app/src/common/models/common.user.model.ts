import { Field, Float, ObjectType, PickType } from '@nestjs/graphql';
import { UserProfile } from 'src/page/personal/general/models/personal.general.userProfile.model';
import { IndexPaginated } from 'src/pagination/index/models/pagination.index.model';

@ObjectType()
export class UserPreview extends PickType(UserProfile, [
  'id',
  'login',
  'imgUrl',
]) {}

@ObjectType()
export class UserRank {
  @Field((_type) => UserPreview)
  userPreview: UserPreview;

  @Field((_type) => Float)
  value: number;

  @Field()
  rank: number;
}

@ObjectType()
export class UserRankWithCoalitionId extends UserRank {
  @Field()
  coalitionId: number;
}

@ObjectType()
export class UserRankingIndexPaginated extends IndexPaginated(UserRank) {}
