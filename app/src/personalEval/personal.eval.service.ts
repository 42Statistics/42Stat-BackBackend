import { Injectable } from '@nestjs/common';
import { ScaleTeamsService } from 'src/scaleTeams/scaleTeams.service';
import { Time } from 'src/util';

@Injectable()
export class PersonalEvalService {
  constructor(private scaleTeamService: ScaleTeamsService) {}

  async currMonthCount(uid: number): Promise<number> {
    const currDate = Time.curr();
    const currMonth = Time.startOfMonth(currDate);

    return await this.scaleTeamService.getEvalCount({
      'corrector.id': uid,
      beginAt: { $gte: currMonth },
      filledAt: { $ne: null },
    });
  }

  async lastMonthCount(uid: number): Promise<number> {
    const currDate = Time.curr();
    const currMonth = Time.startOfMonth(currDate);
    const lastMonth = Time.moveMonth(currMonth, -1);

    return await this.scaleTeamService.getEvalCount({
      'corrector.id': uid,
      beginAt: { $gte: lastMonth, $lt: currMonth },
      filledAt: { $ne: null },
    });
  }

  async totalCount(uid: number): Promise<number> {
    return await this.scaleTeamService.getEvalCount({
      'corrector.id': uid,
      filledAt: { $ne: null },
    });
  }

  async averageDuration(uid: number): Promise<number> {
    return await this.scaleTeamService.getAverageDurationMinute({
      'corrector.id': uid,
    });
  }

  async averageFinalMark(uid: number): Promise<number> {
    return await this.scaleTeamService.getAverageFinalMark(uid);
  }

  async averageFeedbackLength(uid: number): Promise<number> {
    return await this.scaleTeamService.getAverageReviewLength('feedback', {
      'correcteds.id': uid,
    });
  }

  async averageCommentLength(uid: number): Promise<number> {
    return await this.scaleTeamService.getAverageReviewLength('comment', {
      'corrector.id': uid,
    });
  }
}
