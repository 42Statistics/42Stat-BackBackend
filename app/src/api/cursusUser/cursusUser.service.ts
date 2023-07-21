import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Aggregate, FilterQuery, Model, SortValues } from 'mongoose';
import type { AggrNumericPerDateBucket } from 'src/common/db/common.db.aggregation';
import {
  findAll,
  findOne,
  type QueryArgs,
  type QueryOneArgs,
} from 'src/common/db/common.db.query';
import type {
  UserPreview,
  UserRank,
} from 'src/common/models/common.user.model';
import type { DateRangeArgs } from 'src/dateRange/dtos/dateRange.dto';
import type {
  IntPerCircle,
  UserCountPerLevel,
} from 'src/page/home/user/models/home.user.model';
import { StatDate } from 'src/statDate/StatDate';
import { lookupCoalition } from '../coalition/db/coalition.database.aggregate';
import { lookupCoalitionsUser } from '../coalitionsUser/db/coalitionsUser.database.aggregate';
import { lookupQuestsUser } from '../questsUser/db/questsUser.database.aggregate';
import {
  COMMON_CORE_QUEST_ID,
  INNER_QUEST_IDS,
} from '../questsUser/questsUser.service';
import { lookupTitle } from '../title/db/title.database.aggregate';
import { lookupTitlesUser } from '../titlesUser/db/titlesUser.database.aggregate';
import type { UserFullProfile } from './db/cursusUser.database.aggregate';
import {
  aliveUserFilter,
  blackholedUserFilterByDateRange,
} from './db/cursusUser.database.query';
import {
  cursus_user,
  type CursusUserDocument,
} from './db/cursusUser.database.schema';

@Injectable()
export class CursusUserService {
  constructor(
    @InjectModel(cursus_user.name)
    private readonly cursusUserModel: Model<cursus_user>,
  ) {}

  aggregate<ReturnType>(): Aggregate<ReturnType[]> {
    return this.cursusUserModel.aggregate<ReturnType>();
  }

  async findAll(
    queryArgs?: QueryArgs<cursus_user>,
  ): Promise<CursusUserDocument[]> {
    return await findAll(queryArgs)(this.cursusUserModel);
  }

  async findOne(
    queryOneArgs: QueryOneArgs<cursus_user>,
  ): Promise<CursusUserDocument> {
    const cursusUser = await findOne(queryOneArgs)(this.cursusUserModel);

    if (!cursusUser) {
      throw new NotFoundException();
    }

    return cursusUser;
  }

  async findOneByUserId(userId: number): Promise<CursusUserDocument> {
    return await this.findOne({ filter: { 'user.id': userId } });
  }

  async findOneByLogin(login: string): Promise<CursusUserDocument> {
    return await this.findOne({ filter: { 'user.login': login } });
  }

  async findUserPreviewByLogin(
    login: string,
    limit: number,
  ): Promise<UserPreview[]> {
    const result: Map<number, UserPreview> = new Map();

    const previewProjection = {
      'user.id': 1,
      'user.login': 1,
      'user.image': 1,
    };

    const escapedLogin = login.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&');

    const prefixMatches: {
      user: Omit<UserPreview, 'imgUrl'> & { image: { link?: string } };
    }[] = await this.findAll({
      filter: { 'user.login': new RegExp(`^${escapedLogin}`, 'i') },
      select: previewProjection,
      limit,
    });

    prefixMatches.forEach(({ user }) =>
      result.set(user.id, {
        id: user.id,
        login: user.login,
        imgUrl: user.image.link,
      }),
    );

    if (prefixMatches.length < limit) {
      const matches: {
        user: Omit<UserPreview, 'imgUrl'> & { image: { link?: string } };
      }[] = await this.findAll({
        filter: { 'user.login': new RegExp(`.${escapedLogin}`, 'i') },
        select: previewProjection,
        limit: limit - result.size,
      });

      matches.forEach(({ user }) =>
        result.set(user.id, {
          id: user.id,
          login: user.login,
          imgUrl: user.image.link,
        }),
      );
    }

    return [...result.values()];
  }

  async userFullProfile(
    filter?: FilterQuery<cursus_user>,
  ): Promise<UserFullProfile[]> {
    const aggregate = this.cursusUserModel.aggregate<UserFullProfile>();

    if (filter) {
      aggregate.match(filter);
    }

    const userFullProfiles = await aggregate
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

    return userFullProfiles;
  }

  async findOneUserFullProfilebyUserId(
    userId: number,
  ): Promise<UserFullProfile> {
    const [userFullProfiles] = await this.userFullProfile({
      'user.id': userId,
    });

    if (!userFullProfiles) {
      throw new NotFoundException();
    }

    return userFullProfiles;
  }

  async userCount(filter?: FilterQuery<cursus_user>): Promise<number> {
    if (!filter) {
      return await this.cursusUserModel.estimatedDocumentCount();
    }

    return await this.cursusUserModel.countDocuments(filter);
  }

  async userCountPerMonth(
    key: 'beginAt' | 'blackholedAt',
    dateRange: DateRangeArgs,
  ): Promise<AggrNumericPerDateBucket[]> {
    const dates = StatDate.partitionByMonth(dateRange);

    const aggregate =
      this.cursusUserModel.aggregate<AggrNumericPerDateBucket>();

    if (key === 'blackholedAt') {
      aggregate.match(blackholedUserFilterByDateRange());
    }

    return await aggregate
      .append({
        $bucket: {
          groupBy: `$${key}`,
          boundaries: dates,
          default: 'default',
        },
      })
      .addFields({
        date: '$_id',
        value: '$count',
      })
      .sort({ date: 1 })
      .project({
        _id: 0,
        count: 0,
      });
  }

  async userCountPerLevels(): Promise<UserCountPerLevel[]> {
    const aggregate = this.cursusUserModel.aggregate<UserCountPerLevel>();

    return await aggregate
      .match(aliveUserFilter)
      .addFields({ floorLevel: { $floor: '$level' } })
      .group({
        _id: '$floorLevel',
        value: { $count: {} },
      })
      .project({
        _id: 0,
        level: '$_id',
        value: '$value',
      })
      .sort({ level: 1 });
  }

  /**
   *
   * @example
   *
   * ```ts
   * userCountPerCircle(blackholedUserFilter());
   * userCountPerCircle(aliveUserFilter);
   * ```
   */
  async userCountPerCircle(
    filter?: FilterQuery<cursus_user>,
  ): Promise<IntPerCircle[]> {
    const aggregate = this.cursusUserModel.aggregate<{
      _id: number | null;
      value: number;
    }>();

    if (filter) {
      aggregate.match(filter);
    }

    const countPerCircle = await aggregate
      .append(
        lookupQuestsUser('user.id', 'user.id', [
          {
            $match: {
              'quest.id': { $in: INNER_QUEST_IDS },
              validatedAt: { $ne: null },
            },
          },
          {
            $sort: { validatedAt: -1 },
          },
        ]),
      )
      .group({
        _id: { $first: '$quests_users.quest.id' },
        value: { $count: {} },
      })
      .sort({ _id: 1 });

    const commonCoreIndex = countPerCircle.findIndex(
      ({ _id }) => _id === COMMON_CORE_QUEST_ID,
    );

    if (commonCoreIndex !== -1) {
      countPerCircle.push(...countPerCircle.splice(commonCoreIndex, 1));
    }

    return countPerCircle.map(({ value }, index) => ({
      circle: index,
      value,
    }));
  }

  async ranking(
    {
      filter,
      sort,
      limit,
    }: Omit<QueryArgs<cursus_user>, 'sort'> & {
      sort: Record<string, SortValues>;
    },
    valueExtractor: (doc: CursusUserDocument) => UserRank['value'],
  ): Promise<UserRank[]> {
    const rawRanking = await this.findAll({ filter, sort, limit });

    return rawRanking.map((rawRank, index) => ({
      userPreview: {
        id: rawRank.user.id,
        login: rawRank.user.login,
        imgUrl: rawRank.user.image.link,
      },
      value: valueExtractor(rawRank),
      rank: index + 1,
    }));
  }
}
