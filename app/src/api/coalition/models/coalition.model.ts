import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Coalition {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  imageUrl: string;

  @Field()
  coverUrl: string;

  @Field()
  color: string;

  @Field()
  score: number;

  @Field({ description: '코알리숑 마스터의 user id 입니다.' })
  userId: number;
}
