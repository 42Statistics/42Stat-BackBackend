import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Int, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { StatAuthGuard } from 'src/auth/statAuthGuard';
import {
  FloatDateRanged,
  IntDateRanged,
} from 'src/common/models/common.dateRanaged.model';
import { DateTemplateArgs } from 'src/dateRange/dtos/dateRange.dto';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { HomeEvalService } from './home.eval.service';
import { HomeEval } from './models/home.eval.model';

@UseFilters(HttpExceptionFilter)
@UseGuards(StatAuthGuard)
@Resolver((_of: unknown) => HomeEval)
export class HomeEvalResolver {
  constructor(private readonly homeEvalService: HomeEvalService) {}

  @Query((_of) => HomeEval)
  async getHomeEval() {
    return {};
  }

  @ResolveField((_returns) => IntDateRanged)
  async evalCountByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<IntDateRanged> {
    return await this.homeEvalService.evalCountByDateTemplate(dateTemplate);
  }

  @ResolveField((_returns) => FloatDateRanged)
  async averageEvalCountByDateTemplate(
    @Args() { dateTemplate }: DateTemplateArgs,
  ): Promise<FloatDateRanged> {
    return await this.homeEvalService.averageEvalCountByDateTemplate(
      dateTemplate,
    );
  }

  @ResolveField((_returns) => Int)
  async averageFeedbackLength(): Promise<number> {
    return await this.homeEvalService.averageFeedbackLength();
  }

  @ResolveField((_returns) => Int)
  async averageCommentLength(): Promise<number> {
    return await this.homeEvalService.averageCommentLength();
  }
}
