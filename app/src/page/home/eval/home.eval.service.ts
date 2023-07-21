import { Injectable } from '@nestjs/common';
import type { FilterQuery } from 'mongoose';
import { CursusUserService } from 'src/api/cursusUser/cursusUser.service';
import { aliveUserFilter } from 'src/api/cursusUser/db/cursusUser.database.query';
import type { scale_team } from 'src/api/scaleTeam/db/scaleTeam.database.schema';
import {
  AVERAGE_COMMENT_LENGTH,
  AVERAGE_FEEDBACK_LENGTH,
  ScaleTeamCacheService,
} from 'src/api/scaleTeam/scaleTeam.cache.service';
import { ScaleTeamService } from 'src/api/scaleTeam/scaleTeam.service';
import { CacheOnReturn } from 'src/cache/decrators/onReturn/cache.decorator.onReturn.symbol';
import type {
  FloatDateRanged,
  IntDateRanged,
} from 'src/common/models/common.dateRanaged.model';
import { DateRangeService } from 'src/dateRange/dateRange.service';
import type { DateRange, DateTemplate } from 'src/dateRange/dtos/dateRange.dto';

@Injectable()
export class HomeEvalService {
  constructor(
    private readonly scaleTeamService: ScaleTeamService,
    private readonly scaleTeamCacheService: ScaleTeamCacheService,
    private readonly cursusUserService: CursusUserService,
    private readonly dateRangeService: DateRangeService,
  ) {}

  private async evalCount(filter?: FilterQuery<scale_team>): Promise<number> {
    return await this.scaleTeamService.evalCount(filter);
  }

  private async evalCountByDateRange(
    dateRange: DateRange,
  ): Promise<IntDateRanged> {
    const evalFilter: FilterQuery<scale_team> = {
      beginAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
    };

    const evalCount = await this.evalCount(evalFilter);

    return this.dateRangeService.toDateRanged(evalCount, dateRange);
  }

  @CacheOnReturn()
  async evalCountByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<IntDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.evalCountByDateRange(dateRange);
  }

  @CacheOnReturn()
  async averageEvalCountByDateRange(
    dateRange: DateRange,
  ): Promise<FloatDateRanged> {
    const evalCount = await this.evalCount({
      beginAt: this.dateRangeService.aggrFilterFromDateRange(dateRange),
    });

    const aliveUserCount = await this.cursusUserService.userCount(
      aliveUserFilter,
    );

    return this.dateRangeService.toDateRanged(
      Math.floor((evalCount / aliveUserCount) * 100) / 100,
      dateRange,
    );
  }

  @CacheOnReturn()
  async averageEvalCountByDateTemplate(
    dateTemplate: DateTemplate,
  ): Promise<FloatDateRanged> {
    const dateRange = this.dateRangeService.dateRangeFromTemplate(dateTemplate);

    return await this.averageEvalCountByDateRange(dateRange);
  }

  async averageFeedbackLength(): Promise<number> {
    const cachedLength =
      await this.scaleTeamCacheService.getAverageReviewLength(
        AVERAGE_FEEDBACK_LENGTH,
      );

    return (
      cachedLength ??
      (await this.scaleTeamService.averageReviewLength('feedback'))
    );
  }

  async averageCommentLength(): Promise<number> {
    const cachedLength =
      await this.scaleTeamCacheService.getAverageReviewLength(
        AVERAGE_COMMENT_LENGTH,
      );

    return (
      cachedLength ??
      (await this.scaleTeamService.averageReviewLength('comment'))
    );
  }
}
