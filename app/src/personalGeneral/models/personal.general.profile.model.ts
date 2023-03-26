import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoaliltionName } from 'src/total/models/total.type';

@ObjectType()
export class UserTitle {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  isSelected: boolean;
}

@ObjectType()
export class Coalition {
  @Field((_type) => ID)
  id: string;

  @Field()
  name: CoaliltionName;
}

@ObjectType()
export class ScoreInfo {
  @Field()
  current: number;

  @Field()
  rankInCoalition: number;

  @Field()
  rankInTotal: number;
}

export enum UserGrade {
  LEARNER = 'learner',
  MEMBER = 'member',
}

registerEnumType(UserGrade, {
  name: 'UserGrade',
});

@ObjectType()
export class UserProfile {
  @Field((_type) => ID)
  id: string;

  @Field()
  login: string;

  @Field((_type) => UserGrade, { nullable: true })
  grade: UserGrade | null;

  @Field()
  name: string;

  @Field((_type) => Coalition, { nullable: true })
  coalition: Coalition | null;

  @Field()
  imgUrl: string;

  @Field((_type) => [UserTitle], { nullable: 'items' })
  titles: UserTitle[];

  @Field((_type) => Float)
  level: number;

  @Field()
  pooledAt: Date;

  @Field((_type) => Date, { nullable: true })
  blackholedAt: Date | null;

  @Field()
  wallet: number;

  @Field()
  correctionPoint: number;

  @Field()
  scoreInfo: ScoreInfo;
}
