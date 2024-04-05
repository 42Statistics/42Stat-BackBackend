import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder } from 'mongoose';
import { CursusUserCacheService } from 'src/api/cursusUser/cursusUser.cache.service';
import {
  findAllAndLean,
  findOneAndLean,
  QueryArgs,
  QueryOneArgs,
} from 'src/database/mongoose/database.mongoose.query';
import { followFeed } from 'src/feed/db/feed.database.schema';
import { FeedType } from 'src/feed/dto/feed.dto';
import { PaginationIndexService } from 'src/pagination/index/pagination.index.service';
import { follow } from './db/follow.database.schema';
import { FollowSortOrder, type FollowPaginatedArgs } from './dto/follow.dto';
import { FollowCacheService } from './follow.cache.service';
import type {
  Follow,
  FollowSuccess,
  MyFollow,
  MyFollowPaginated,
} from './model/follow.model';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(follow.name)
    private readonly followModel: Model<follow>,
    @InjectModel(followFeed.name)
    private readonly followFeedModel: Model<followFeed>,
    private readonly cursusUserCacheService: CursusUserCacheService,
    private readonly paginationIndexService: PaginationIndexService,
    private readonly followCacheService: FollowCacheService,
  ) {}

  async findOneAndLean(
    queryOneArgs?: QueryOneArgs<follow>,
  ): Promise<follow | null> {
    return await findOneAndLean(this.followModel, queryOneArgs);
  }

  async findAllAndLean(queryArgs?: QueryArgs<follow>): Promise<follow[]> {
    return await findAllAndLean(this.followModel, queryArgs);
  }

  async followUser(userId: number, targetId: number): Promise<FollowSuccess> {
    const alreadyFollow = await this.followModel.findOne(
      {
        userId,
        followId: targetId,
      },
      { _id: 1 },
    );

    if (userId === targetId || alreadyFollow) {
      throw new NotFoundException();
    }

    const followAt = new Date();

    const target = await this.cursusUserCacheService.getUserPreview(targetId);

    if (!target) {
      throw new NotFoundException();
    }

    await this.followModel.create({
      userId,
      followId: targetId,
      followAt,
    });

    const cachedfollowingList = await this.followCacheService.get(
      userId,
      'following',
    );

    cachedfollowingList.push({ userPreview: target, followAt });

    const cachedfollowerList = await this.followCacheService.get(
      targetId,
      'follower',
    );

    const user = await this.cursusUserCacheService.getUserPreview(userId);

    if (!user) {
      throw new NotFoundException();
    }

    cachedfollowerList.push({ userPreview: user, followAt });

    //todo: feed 실패와 follow 실패 구분 안되는 중
    await this.followFeedModel.create({
      createdAt: followAt,
      userPreview: user,
      type: FeedType.FOLLOW,
      followed: target,
    });

    return {
      userId,
      followId: targetId,
    };
  }

  async unfollowUser(userId: number, targetId: number): Promise<FollowSuccess> {
    const deletedCount = await this.followModel
      .deleteOne({
        userId,
        followId: targetId,
      })
      .then((result) => result.deletedCount);

    if (deletedCount !== 1) {
      throw new NotFoundException();
    }

    const cachedFollowingList = await this.followCacheService.get(
      userId,
      'following',
    );

    const updatedFollowingList = cachedFollowingList.filter(
      (follow) => follow.userPreview.id !== targetId,
    );

    await this.followCacheService.set({
      id: userId,
      type: 'following',
      list: updatedFollowingList,
    });

    const cachedFollowerList = await this.followCacheService.get(
      targetId,
      'follower',
    );

    const updatedFollowerList = cachedFollowerList.filter(
      (follow) => follow.userPreview.id !== userId,
    );

    await this.followCacheService.set({
      id: targetId,
      type: 'follower',
      list: updatedFollowerList,
    });

    return {
      userId,
      followId: targetId,
    };
  }

  async followerList(
    userId: number,
    targetId: number,
    sortOrder: FollowSortOrder,
    filter?: FilterQuery<follow>,
  ): Promise<MyFollow[]> {
    const aggregate = this.followModel.aggregate<follow>();

    const cachedFollowerList = await this.followCacheService.get(
      targetId,
      'follower',
    );

    if (cachedFollowerList.length) {
      return await this.checkFollowing({
        userId,
        followList: cachedFollowerList,
      });
    }

    if (filter) {
      aggregate.match(filter);
    }

    const followerUserPreview = await this.followerListCache(
      targetId,
      sortOrder,
    );

    const followerList = await this.checkFollowing({
      userId,
      followList: followerUserPreview,
    });

    await this.followCacheService.set({
      id: targetId,
      type: 'follower',
      list: followerList,
    });

    return followerList;
  }

  async followerPaginated(
    userId: number,
    { pageNumber, pageSize, targetId, sortOrder }: FollowPaginatedArgs,
  ): Promise<MyFollowPaginated> {
    const followList = await this.followerList(userId, targetId, sortOrder);

    return this.paginationIndexService.toPaginated<MyFollow>(followList, {
      pageNumber,
      pageSize,
    });
  }

  async followingList(
    userId: number,
    targetId: number,
    sortOrder: FollowSortOrder,
    filter?: FilterQuery<follow>,
  ): Promise<MyFollow[]> {
    const aggregate = this.followModel.aggregate<follow>();

    const cachedFollowingList = await this.followCacheService.get(
      targetId,
      'following',
    );

    if (cachedFollowingList.length) {
      const followingList = await this.checkFollowing({
        userId,
        followList: cachedFollowingList,
      });

      if (sortOrder === FollowSortOrder.FOLLOW_AT_ASC) {
        followingList.sort(
          (a, b) => a.followAt.getTime() - b.followAt.getTime(),
        );
      } else if (sortOrder === FollowSortOrder.FOLLOW_AT_DESC) {
        followingList.sort(
          (a, b) => b.followAt.getTime() - a.followAt.getTime(),
        );
      }

      return followingList;
    }

    if (filter) {
      aggregate.match(filter);
    }

    const followingUserPreview = await this.followingListCache(
      targetId,
      sortOrder,
    );

    const followingList = await this.checkFollowing({
      userId,
      followList: followingUserPreview,
    });

    await this.followCacheService.set({
      id: targetId,
      type: 'following',
      list: followingList,
    });

    return followingList;
  }

  async followingPaginated(
    userId: number,
    { pageNumber, pageSize, targetId, sortOrder }: FollowPaginatedArgs,
  ): Promise<MyFollowPaginated> {
    const followList = await this.followingList(userId, targetId, sortOrder);

    return this.paginationIndexService.toPaginated<MyFollow>(followList, {
      pageSize,
      pageNumber,
    });
  }

  async followerCount(
    followId: number,
    filter?: FilterQuery<follow>,
  ): Promise<number> {
    return await this.followModel.countDocuments({ followId, filter });
  }

  async followingCount(
    userId: number,
    filter?: FilterQuery<follow>,
  ): Promise<number> {
    return await this.followModel.countDocuments({ userId, filter });
  }

  async isFollowing(userId: number, followId: number): Promise<boolean> {
    return !!(await this.followModel.findOne({
      userId,
      followId,
    }));
  }

  async followingListCache(
    targetId: number,
    sortOrder: FollowSortOrder,
  ): Promise<Follow[]> {
    const following: Pick<follow, 'followId' | 'followAt'>[] =
      await this.findAllAndLean({
        filter: { userId: targetId },
        select: { _id: 0, followId: 1, followAt: 1 },
        sort: followSort(sortOrder),
      });

    const followingUserPreview = await Promise.all(
      following.map(async (following) => {
        const userFullProfile = await this.cursusUserCacheService
          .getUserFullProfile(following.followId)
          .then((user) => user?.cursusUser.user);

        if (!userFullProfile) {
          throw new NotFoundException();
        }

        const userPreview = {
          id: userFullProfile.id,
          login: userFullProfile.login,
          imgUrl: userFullProfile.image.link,
        };

        if (!userPreview) {
          throw new NotFoundException();
        }

        return { userPreview, followAt: following.followAt };
      }),
    );

    return followingUserPreview;
  }

  async followerListCache(
    targetId: number,
    sortOrder: FollowSortOrder,
  ): Promise<Follow[]> {
    const follower: Pick<follow, 'userId' | 'followAt'>[] =
      await this.findAllAndLean({
        filter: { followId: targetId },
        select: { _id: 0, userId: 1, followAt: 1 },
        sort: followSort(sortOrder),
      });

    const followerUserPreview = await Promise.all(
      follower.map(async (follower) => {
        const userFullProfile = await this.cursusUserCacheService
          .getUserFullProfile(follower.userId)
          .then((user) => user?.cursusUser.user);

        if (!userFullProfile) {
          throw new NotFoundException();
        }

        const userPreview = {
          id: userFullProfile.id,
          login: userFullProfile.login,
          imgUrl: userFullProfile.image.link,
        };

        if (!userPreview) {
          throw new NotFoundException();
        }

        return { userPreview, followAt: follower.followAt };
      }),
    );

    return followerUserPreview;
  }

  async checkFollowing({
    userId,
    followList,
  }: {
    userId: number;
    followList: Follow[];
  }): Promise<MyFollow[]> {
    const followingList = await this.followCacheService.get(
      userId,
      'following',
    );

    const followingListIds = followingList.map((e) => e.userPreview.id);

    const myFollow = Promise.all(
      followList.map(async (follow) => {
        const isFollowing = followingListIds.includes(follow.userPreview.id);

        return {
          isFollowing,
          followAt: follow.followAt,
          userPreview: follow.userPreview,
        };
      }),
    );

    return myFollow;
  }
}

const followSort = (sortOrder: FollowSortOrder): Record<string, SortOrder> => {
  switch (sortOrder) {
    case FollowSortOrder.FOLLOW_AT_ASC:
      return { followAt: 'asc' };
    case FollowSortOrder.FOLLOW_AT_DESC:
      return { followAt: 'desc' };
  }
};
