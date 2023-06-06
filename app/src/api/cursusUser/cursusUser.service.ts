import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Aggregate, FilterQuery, Model } from 'mongoose';
import type {
  AggrNumeric,
  AggrNumericPerDate,
} from 'src/common/db/common.db.aggregation';
import type {
  UserPreview,
  UserRanking,
} from 'src/common/models/common.user.model';
import type { DateRangeArgs } from 'src/dateRange/dtos/dateRange.dto';
import type {
  UserCountPerLevels,
  ValuePerCircle,
} from 'src/page/home/user/models/home.user.model';
import { Time } from 'src/util';
import {
  CursusUserDocument,
  User,
  cursus_user,
} from './db/cursusUser.database.schema';
import { CoalitionsUserDocument } from '../coalitionsUser/db/coalitionsUser.database.schema';
import { UserFullProfile } from './db/cursusUser.database.aggregate';
import { lookupCoalitionsUser } from '../coalitionsUser/db/coalitionsUser.database.aggregate';
import { lookupCoalition } from '../coalition/db/coalition.database.aggregate';
import { lookupTitlesUser } from '../titlesUser/db/titlesUser.database.aggregate';
import { lookupTitle } from '../title/db/title.database.aggregate';

export const FT_CURSUS = 21;

@Injectable()
export class CursusUserService {
  constructor(
    @InjectModel(cursus_user.name)
    private cursusUserModel: Model<cursus_user>,
  ) {}

  aggregate<ReturnType>(): Aggregate<ReturnType[]> {
    return this.cursusUserModel.aggregate<ReturnType>();
  }

  async findAll(
    filter: FilterQuery<CursusUserDocument> = {},
  ): Promise<CursusUserDocument[]> {
    return await this.cursusUserModel.find(filter);
  }

  async findOne(
    filter: FilterQuery<CursusUserDocument> = {},
  ): Promise<CursusUserDocument> {
    const cursusUser = await this.cursusUserModel.findOne(filter);

    if (!cursusUser) {
      throw new NotFoundException();
    }

    return cursusUser;
  }

  async findOneByUserId(userId: number): Promise<CursusUserDocument> {
    return await this.findOne({ 'user.id': userId });
  }

  async findOneByLogin(login: string): Promise<CursusUserDocument> {
    return await this.findOne({ 'user.login': login });
  }

  async findUserPreviewByLogin(
    login: string,
    limit: number,
  ): Promise<UserPreview[]> {
    type Userable = Pick<User, 'id' | 'login' | 'image'>;

    const extractUserPreview = ({
      id,
      login,
      image,
    }: Userable): UserPreview => ({
      id,
      login,
      imgUrl: image?.link,
    });

    const result: Map<number, UserPreview> = new Map();

    const previewProjection = {
      'user.id': 1,
      'user.login': 1,
      'user.image': 1,
    };

    const prefixMatches: { user: Userable }[] = await this.cursusUserModel
      .find(
        {
          'user.login': { $regex: `^${login}`, $options: 'i' },
        },
        previewProjection,
      )
      .limit(limit);

    prefixMatches.forEach(({ user }) =>
      result.set(user.id, extractUserPreview(user)),
    );

    if (prefixMatches.length < limit) {
      const matches: { user: Userable }[] = await this.cursusUserModel
        .find(
          {
            'user.login': { $regex: login, $options: 'i' },
          },
          previewProjection,
        )
        .limit(limit - prefixMatches.length);

      matches.forEach(({ user }) =>
        result.set(user.id, extractUserPreview(user)),
      );
    }

    return [...result.values()];
  }

  async userCount(filter?: FilterQuery<CursusUserDocument>): Promise<number> {
    if (!filter) {
      return await this.cursusUserModel.estimatedDocumentCount();
    }

    return await this.cursusUserModel.countDocuments(filter);
  }

  async countPerMonth(
    key: 'beginAt' | 'blackholedAt',
    dateRange: DateRangeArgs,
  ): Promise<AggrNumericPerDate[]> {
    const dateObject = Time.dateToBoundariesObject(dateRange);

    const aggregate = this.cursusUserModel.aggregate<AggrNumericPerDate>();

    return await aggregate
      .append({
        $bucket: {
          groupBy: {
            $dateToString: {
              date: `$${key}`,
              format: '%Y-%m-%dT%H:%M:%S.%LZ',
            },
          },
          boundaries: dateObject,
          default: 'defalut',
        },
      })
      .addFields({
        date: '$_id',
        value: '$count',
      })
      .project({
        _id: 0,
        count: 0,
      })
      .sort({
        date: 1,
      });
  }

  async userFullProfile(userId: number): Promise<UserFullProfile> {
    const aggregate = this.cursusUserModel.aggregate<UserFullProfile>();

    const [cursusUserProfile] = await aggregate
      .match({ 'user.id': userId, 'cursus.id': FT_CURSUS })
      .addFields({
        cursusUser: '$$ROOT',
      })
      .append(
        lookupCoalitionsUser('user.id', 'userId', [
          lookupCoalition('coalitionId', 'id'),
          { $addFields: { coalitions: { $first: '$coalitions' } } },
        ]),
      )
      .append(
        lookupTitlesUser('user.id', 'userId', [
          lookupTitle('titleId', 'id'),
          { $addFields: { titles: { $first: '$titles' } } },
        ]),
      )
      .project({
        cursusUser: 1,
        coalition: { $first: '$coalitions_users.coalitions' },
        titlesUsers: '$titles_users',
      });

    if (!cursusUserProfile) {
      throw new NotFoundException();
    }

    return cursusUserProfile;
  }

  async userCountPerLevels(): Promise<UserCountPerLevels[]> {
    const aggregate = this.cursusUserModel.aggregate<UserCountPerLevels>();

    return await aggregate
      .addFields({ floorLevel: { $floor: '$level' } })
      .group({
        _id: '$floorLevel',
        userCount: { $count: {} },
      })
      .project({
        _id: 0,
        level: '$_id',
        userCount: '$userCount',
      })
      .sort({ level: 1 });
  }

  async rank(
    key: string,
    limit: number,
    filter?: FilterQuery<CursusUserDocument>,
  ): Promise<UserRanking[]> {
    const aggregate = this.cursusUserModel.aggregate<UserRanking>();

    if (filter) {
      aggregate.match(filter);
    }

    return await aggregate
      .match({ 'user.active?': true })
      .match({ 'user.kind': 'student' })
      .sort({ [`${key}`]: -1 })
      .limit(limit)
      .project({
        _id: 0,
        userPreview: {
          id: '$user.id',
          login: '$user.login',
          imgUrl: '$user.image.link',
        },
        value: `$${key}`,
      });
  }

  // executionTimeMillisEstimate: 319
  async blackholedCountPerCircles(): Promise<ValuePerCircle[]> {
    const aggregate = this.cursusUserModel.aggregate<ValuePerCircle>();

    return await aggregate
      .match({
        blackholedAt: {
          $ne: null,
          $lt: Time.now(),
        },
      })
      .lookup({
        from: 'quests_users',
        localField: 'user.id',
        foreignField: 'user.id',
        pipeline: [
          {
            $match: {
              validatedAt: {
                $ne: null,
              },
              'quest.slug': {
                $ne: 'exam-rank-06',
              },
            },
          },
          {
            $project: {
              validatedAt: 1,
              slug: '$quest.slug',
            },
          },
        ],
        as: 'quests_users',
      })
      .unwind({
        path: '$quests_users',
        preserveNullAndEmptyArrays: true,
      })
      .group({
        _id: '$user.id',
        slug: {
          $addToSet: '$quests_users.slug',
        },
      })
      .addFields({
        size: {
          $size: '$slug',
        },
      })
      .group({
        _id: '$size',
        value: {
          $count: {},
        },
      })
      .addFields({
        circle: '$_id',
      })
      .project({
        _id: 0,
        circle: 1,
        value: 1,
      })
      .sort({
        circle: 1,
      });
  }
}
