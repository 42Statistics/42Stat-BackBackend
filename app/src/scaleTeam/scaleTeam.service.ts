import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScaleTeam, ScaleTeamDocument } from './scaleTeam.database.schema';

@Injectable()
export class ScaleTeamService {
  constructor(@InjectModel(ScaleTeam.name) private scaleTeamModel: Model<ScaleTeamDocument>) {}

  async create(): Promise<ScaleTeam> {
    //todo: return []
    const scaleTeamData: ScaleTeam[] = [
      {
        id: 5229461,
        scale_id: 20926,
        comment:
          'Makefile부터 모든 코드를 다 열어서 보았습니다. Makefile에 헤더가 변경 되었을 경우에 대해서까지 처리를 해주신 분은 흔치 않았는데, 상민님은 그 부분까지 슬랙에서 찾아서 해결을 해내셔서 엄청 꼼꼼하게 작성하셨구나 느꼈습니다.\r\nc코드들의 경우에는 앞에서 작성한 다른 libft의 함수를 많이 이용하는 방식으로 만드셨는데, 코드들이 간결하게 짜여져서 저도 나중에 다시 코드를 짠다면 이런 방식을 채용하고 싶습니다. atoi에서는 longlong값을 초과하는 부분에 대해서 처리를 해주신 분이 흔치 않은데 이 부분도 처리를 해주셔서 여러모로 많이 준비하고 평가를 받으신 걸 알 수 있었어요!\r\n러쉬00 팀원이었는데 본과정에서 다시 만날 수 있게 되어서 너무 좋네요~ 다음에 또 뵈어요!!',
        created_at: '2023-04-02T13:36:31.269Z',
        updated_at: '2023-04-02T15:10:14.014Z',
        feedback:
          '피신때 만나고, 이렇게 또 평가로 만나게 돼서 반가웠습니다. :) 함수를 하나씩 보면서 잘못된 부분이 있는지, 예외 처리를 잘 해줬는지 등 꼼꼼히 봐주셨습니다. 그리고 오리지널 함수와 ft 함수는 완전 똑같아야 하는가에 대한 이야기도 해보았습니다. 함수 별로 해당 함수에 필요한 부분이나 다른 평가에서는 어떤 것을 평가 기준으로 잡고 있는지 등 libft의 평가 기준에 대한 이야기를 나눌 수 있었습니다. 긴 시간은 아니었지만, 평가를 진행하면서 간단한 사담 나눌 수 있어서 좋았습니다. 고생하셨습니다!! ',
        final_mark: 125,
        flag: {
          id: 9,
          name: 'Outstanding project',
          positive: true,
          icon: 'star-1',
          created_at: '2017-05-18T14:07:37.380Z',
          updated_at: '2017-05-18T14:12:07.415Z',
        },
        begin_at: '2023-04-02T14:15:00.000Z',
        correcteds: [
          {
            id: 141337,
            login: 'sanseo',
            url: 'https://api.intra.42.fr/v2/users/sanseo',
          },
        ],
        corrector: {
          id: 141461,
          login: 'kyusukim',
          url: 'https://api.intra.42.fr/v2/users/kyusukim',
        },
        truant: {},
        filled_at: '2023-04-02T15:03:36.217Z',
        questions_with_answers: [],
        scale: {
          id: 20926,
          evaluation_id: 4715,
          name: 'scale 6',
          is_primary: true,
          comment: '',
          introduction_md:
            "Please comply with the following rules:\n\n- Remain polite, courteous, respectful and constructive throughout the \n  evaluation process. The well-being of the community depends on it.\n\n- Identify with the student or group whose work is evaluated the possible \n  dysfunctions in their project. Take the time to discuss and debate the \n  problems that may have been identified.\n\n- You must consider that there might be some differences in how your peers \n  might have understood the project's instructions and the scope of its \n  functionalities. Always keep an open mind and grade them as honestly as \n  possible. The pedagogy is useful only and only if the peer-evaluation is \n  done seriously.\n",
          disclaimer_md: '',
          guidelines_md:
            "- Only grade the work that was turned in the Git repository of the evaluated \n  student or group.\n\n- Double-check that the Git repository belongs to the student(s). Ensure that \n  the project is the one expected. Also, check that 'git clone' is used in an \n  empty folder.\n\n- Check carefully that no malicious aliases was used to fool you and make you \n  evaluate something that is not the content of the official repository.\n\n- To avoid any surprises and if applicable, review together any scripts used \n  to facilitate the grading (scripts for testing or automation).\n\n- Do not blindly trust any scripts. The tester could be wrong!\n\n- Check the makefile: no wildcard, no relink, or the final grade is 0.\n\n- Use make, then make --debug to be sure.\n\n- If you have not completed the assignment you are going to evaluate, you have \n  to read the entire subject prior to starting the evaluation process.\n\n- Use the available flags to report an empty repository, a non-functioning \n  program, a Norm error, cheating, and so forth. \n  In these cases, the evaluation process ends and the final grade is 0, \n  or -42 in case of cheating. However, except for cheating, student are \n  strongly encouraged to review together the work that was turned in, in order \n  to identify any mistakes that shouldn't be repeated in the future.\n\n- You should never have to edit any file except the configuration file if it \n  exists. If you want to edit a file, take the time to explicit the reasons \n  with the evaluated student and make sure both of you are okay with this.\n\n- You must also verify the absence of memory leaks. Any memory allocated on \n  the heap must be properly freed before the end of execution. \n  You are allowed to use any of the different tools available on the computer, \n  such as leaks, valgrind, or e_fence. In case of memory leaks, tick the \n  appropriate flag.\n",
          created_at: '2023-02-21T01:17:38.303Z',
          correction_number: 3,
          duration: 1800,
          manual_subscription: true,
          languages: [
            {
              id: 2,
              name: 'English',
              identifier: 'en',
              created_at: '2015-04-14T16:07:38.122Z',
              updated_at: '2023-03-27T15:00:59.657Z',
            },
            {
              id: 1,
              name: 'Français',
              identifier: 'fr',
              created_at: '2014-11-02T16:43:38.466Z',
              updated_at: '2023-03-27T14:59:00.134Z',
            },
            {
              id: 11,
              name: 'Spanish',
              identifier: 'es',
              created_at: '2019-08-09T15:14:32.544Z',
              updated_at: '2023-03-27T14:59:02.642Z',
            },
            {
              id: 18,
              name: 'Turkish',
              identifier: 'tr',
              created_at: '2021-08-20T10:50:01.782Z',
              updated_at: '2023-03-27T14:59:04.909Z',
            },
          ],
          flags: [
            {
              id: 1,
              name: 'Ok',
              positive: true,
              icon: 'check-4',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 2,
              name: 'Empty work',
              positive: false,
              icon: 'file-1',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 3,
              name: 'Incomplete work',
              positive: false,
              icon: 'file-attention',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 5,
              name: 'Invalid compilation',
              positive: false,
              icon: 'skull-2',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 6,
              name: 'Norme',
              positive: false,
              icon: 'receipt-1',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 7,
              name: 'Cheat',
              positive: false,
              icon: 'layers',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 8,
              name: 'Crash',
              positive: false,
              icon: 'bomb',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 9,
              name: 'Outstanding project',
              positive: true,
              icon: 'star-1',
              created_at: '2017-05-18T14:07:37.380Z',
              updated_at: '2017-05-18T14:12:07.415Z',
            },
            {
              id: 11,
              name: 'Concerning situation',
              positive: false,
              icon: 'alert-2',
              created_at: '2017-11-03T12:27:44.876Z',
              updated_at: '2017-11-03T12:27:44.876Z',
            },
            {
              id: 12,
              name: 'Leaks',
              positive: false,
              icon: 'blood',
              created_at: '2018-02-09T15:50:28.558Z',
              updated_at: '2018-02-09T15:50:28.558Z',
            },
            {
              id: 13,
              name: 'Forbidden Function',
              positive: false,
              icon: 'delete-2',
              created_at: '2018-05-15T12:44:59.600Z',
              updated_at: '2018-05-15T12:44:59.600Z',
            },
          ],
          free: false,
        },
        team: {
          id: 4791334,
          name: "sanseo's group-1",
          url: 'https://api.intra.42.fr/v2/teams/4791334',
          final_mark: 125,
          project_id: 1314,
          created_at: '2023-04-02T09:38:01.215Z',
          updated_at: '2023-04-02T15:11:23.727Z',
          status: 'finished',
          terminating_at: null,
          users: [
            {
              id: 141337,
              login: 'sanseo',
              url: 'https://api.intra.42.fr/v2/users/sanseo',
              leader: true,
              occurrence: 1,
              validated: true,
              projects_user_id: 3024474,
            },
          ],
          locked: true,
          validated: true,
          closed: true,
          repo_url: 'git@vogsphere.42seoul.kr:vogsphere/intra-uuid-30f04348-e55a-476f-88be-067fa57cee8d-4791334-sanseo',
          repo_uuid: 'intra-uuid-30f04348-e55a-476f-88be-067fa57cee8d-4791334-sanseo',
          locked_at: '2023-04-02T09:38:01.245Z',
          closed_at: '2023-04-02T09:54:10.806Z',
          project_session_id: 6957,
          project_gitlab_path: 'pedago_world/42-cursus/inner-circle/libft',
        },
        feedbacks: [
          {
            id: 5214016,
            user: {
              login: 'sanseo',
              id: 141337,
              url: 'https://profile.intra.42.fr/users/sanseo',
            },
            feedbackable_type: 'ScaleTeam',
            feedbackable_id: 5229461,
            comment:
              '피신때 만나고, 이렇게 또 평가로 만나게 돼서 반가웠습니다. :) 함수를 하나씩 보면서 잘못된 부분이 있는지, 예외 처리를 잘 해줬는지 등 꼼꼼히 봐주셨습니다. 그리고 오리지널 함수와 ft 함수는 완전 똑같아야 하는가에 대한 이야기도 해보았습니다. 함수 별로 해당 함수에 필요한 부분이나 다른 평가에서는 어떤 것을 평가 기준으로 잡고 있는지 등 libft의 평가 기준에 대한 이야기를 나눌 수 있었습니다. 긴 시간은 아니었지만, 평가를 진행하면서 간단한 사담 나눌 수 있어서 좋았습니다. 고생하셨습니다!! ',
            rating: 5,
            created_at: '2023-04-02T15:10:13.883Z',
          },
        ],
      },
      {
        id: 5229306,
        scale_id: 20926,
        comment:
          '상당히 긴 시간동안 평가를 진행했지만 하나하나 친절하게 답변하셔서 편안하게 평가를 진행했습니다.  함수 argument로  null이 들어오는 상황을 최대한 디펜스 하려는 코드를 오랜만에 보아서 저와는 완전히 반대의 코드를 작성하신 모습이 새로웠습니다. 일관성을 위해 모두 null 처리를 해준다면 안정성있는 프로그램을 작성할 수 있겠다고 생각하기 때문에 아웃스탠딩을 드렸습니다! 수고하셨습니다.',
        created_at: '2023-04-02T11:52:26.027Z',
        updated_at: '2023-04-02T13:21:34.233Z',
        feedback:
          'libft에서 구현해야 하는 각각의 함수에 대해 자세히 알고 계셨습니다. 신경써야 할 것 같은 세세한 부분(오버플로우, 예외 처리 등)에 대해 심도 있는 이야기를 나눌 수 있었고, 그러한 부분까지 생각을 하셨다는게 대단하다는 생각이 들었습니다. 이번 평가를 통해서 특히 malloc과 calloc에 대해 알아갈 수 있었습니다. 지금까지 봤던 분들 중에 함수에 대해 가장 깊게 생각하고 계셨고, 구현하는데 생각을 많이하신다는 생각이 들었습니다. 다음엔 libft 통과하실 것 같습니다. 고생하셨습니다!!',
        final_mark: 125,
        flag: {
          id: 9,
          name: 'Outstanding project',
          positive: true,
          icon: 'star-1',
          created_at: '2017-05-18T14:07:37.380Z',
          updated_at: '2017-05-18T14:12:07.415Z',
        },
        begin_at: '2023-04-02T12:30:00.000Z',
        correcteds: [
          {
            id: 141337,
            login: 'sanseo',
            url: 'https://api.intra.42.fr/v2/users/sanseo',
          },
        ],
        corrector: {
          id: 141516,
          login: 'hojuchoi',
          url: 'https://api.intra.42.fr/v2/users/hojuchoi',
        },
        truant: {},
        filled_at: '2023-04-02T13:15:30.868Z',
        questions_with_answers: [],
        scale: {
          id: 20926,
          evaluation_id: 4715,
          name: 'scale 6',
          is_primary: true,
          comment: '',
          introduction_md:
            "Please comply with the following rules:\n\n- Remain polite, courteous, respectful and constructive throughout the \n  evaluation process. The well-being of the community depends on it.\n\n- Identify with the student or group whose work is evaluated the possible \n  dysfunctions in their project. Take the time to discuss and debate the \n  problems that may have been identified.\n\n- You must consider that there might be some differences in how your peers \n  might have understood the project's instructions and the scope of its \n  functionalities. Always keep an open mind and grade them as honestly as \n  possible. The pedagogy is useful only and only if the peer-evaluation is \n  done seriously.\n",
          disclaimer_md: '',
          guidelines_md:
            "- Only grade the work that was turned in the Git repository of the evaluated \n  student or group.\n\n- Double-check that the Git repository belongs to the student(s). Ensure that \n  the project is the one expected. Also, check that 'git clone' is used in an \n  empty folder.\n\n- Check carefully that no malicious aliases was used to fool you and make you \n  evaluate something that is not the content of the official repository.\n\n- To avoid any surprises and if applicable, review together any scripts used \n  to facilitate the grading (scripts for testing or automation).\n\n- Do not blindly trust any scripts. The tester could be wrong!\n\n- Check the makefile: no wildcard, no relink, or the final grade is 0.\n\n- Use make, then make --debug to be sure.\n\n- If you have not completed the assignment you are going to evaluate, you have \n  to read the entire subject prior to starting the evaluation process.\n\n- Use the available flags to report an empty repository, a non-functioning \n  program, a Norm error, cheating, and so forth. \n  In these cases, the evaluation process ends and the final grade is 0, \n  or -42 in case of cheating. However, except for cheating, student are \n  strongly encouraged to review together the work that was turned in, in order \n  to identify any mistakes that shouldn't be repeated in the future.\n\n- You should never have to edit any file except the configuration file if it \n  exists. If you want to edit a file, take the time to explicit the reasons \n  with the evaluated student and make sure both of you are okay with this.\n\n- You must also verify the absence of memory leaks. Any memory allocated on \n  the heap must be properly freed before the end of execution. \n  You are allowed to use any of the different tools available on the computer, \n  such as leaks, valgrind, or e_fence. In case of memory leaks, tick the \n  appropriate flag.\n",
          created_at: '2023-02-21T01:17:38.303Z',
          correction_number: 3,
          duration: 1800,
          manual_subscription: true,
          languages: [
            {
              id: 2,
              name: 'English',
              identifier: 'en',
              created_at: '2015-04-14T16:07:38.122Z',
              updated_at: '2023-03-27T15:00:59.657Z',
            },
            {
              id: 1,
              name: 'Français',
              identifier: 'fr',
              created_at: '2014-11-02T16:43:38.466Z',
              updated_at: '2023-03-27T14:59:00.134Z',
            },
            {
              id: 11,
              name: 'Spanish',
              identifier: 'es',
              created_at: '2019-08-09T15:14:32.544Z',
              updated_at: '2023-03-27T14:59:02.642Z',
            },
            {
              id: 18,
              name: 'Turkish',
              identifier: 'tr',
              created_at: '2021-08-20T10:50:01.782Z',
              updated_at: '2023-03-27T14:59:04.909Z',
            },
          ],
          flags: [
            {
              id: 1,
              name: 'Ok',
              positive: true,
              icon: 'check-4',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 2,
              name: 'Empty work',
              positive: false,
              icon: 'file-1',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 3,
              name: 'Incomplete work',
              positive: false,
              icon: 'file-attention',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 5,
              name: 'Invalid compilation',
              positive: false,
              icon: 'skull-2',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 6,
              name: 'Norme',
              positive: false,
              icon: 'receipt-1',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 7,
              name: 'Cheat',
              positive: false,
              icon: 'layers',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 8,
              name: 'Crash',
              positive: false,
              icon: 'bomb',
              created_at: '2015-09-14T23:06:52.000Z',
              updated_at: '2015-09-14T23:06:52.000Z',
            },
            {
              id: 9,
              name: 'Outstanding project',
              positive: true,
              icon: 'star-1',
              created_at: '2017-05-18T14:07:37.380Z',
              updated_at: '2017-05-18T14:12:07.415Z',
            },
            {
              id: 11,
              name: 'Concerning situation',
              positive: false,
              icon: 'alert-2',
              created_at: '2017-11-03T12:27:44.876Z',
              updated_at: '2017-11-03T12:27:44.876Z',
            },
            {
              id: 12,
              name: 'Leaks',
              positive: false,
              icon: 'blood',
              created_at: '2018-02-09T15:50:28.558Z',
              updated_at: '2018-02-09T15:50:28.558Z',
            },
            {
              id: 13,
              name: 'Forbidden Function',
              positive: false,
              icon: 'delete-2',
              created_at: '2018-05-15T12:44:59.600Z',
              updated_at: '2018-05-15T12:44:59.600Z',
            },
          ],
          free: false,
        },
        team: {
          id: 4791334,
          name: "sanseo's group-1",
          url: 'https://api.intra.42.fr/v2/teams/4791334',
          final_mark: 125,
          project_id: 1314,
          created_at: '2023-04-02T09:38:01.215Z',
          updated_at: '2023-04-02T15:11:23.727Z',
          status: 'finished',
          terminating_at: null,
          users: [
            {
              id: 141337,
              login: 'sanseo',
              url: 'https://api.intra.42.fr/v2/users/sanseo',
              leader: true,
              occurrence: 1,
              validated: true,
              projects_user_id: 3024474,
            },
          ],
          locked: true,
          validated: true,
          closed: true,
          repo_url: 'git@vogsphere.42seoul.kr:vogsphere/intra-uuid-30f04348-e55a-476f-88be-067fa57cee8d-4791334-sanseo',
          repo_uuid: 'intra-uuid-30f04348-e55a-476f-88be-067fa57cee8d-4791334-sanseo',
          locked_at: '2023-04-02T09:38:01.245Z',
          closed_at: '2023-04-02T09:54:10.806Z',
          project_session_id: 6957,
          project_gitlab_path: 'pedago_world/42-cursus/inner-circle/libft',
        },
        feedbacks: [
          {
            id: 5213849,
            user: {
              login: 'sanseo',
              id: 141337,
              url: 'https://profile.intra.42.fr/users/sanseo',
            },
            feedbackable_type: 'ScaleTeam',
            feedbackable_id: 5229306,
            comment:
              'libft에서 구현해야 하는 각각의 함수에 대해 자세히 알고 계셨습니다. 신경써야 할 것 같은 세세한 부분(오버플로우, 예외 처리 등)에 대해 심도 있는 이야기를 나눌 수 있었고, 그러한 부분까지 생각을 하셨다는게 대단하다는 생각이 들었습니다. 이번 평가를 통해서 특히 malloc과 calloc에 대해 알아갈 수 있었습니다. 지금까지 봤던 분들 중에 함수에 대해 가장 깊게 생각하고 계셨고, 구현하는데 생각을 많이하신다는 생각이 들었습니다. 다음엔 libft 통과하실 것 같습니다. 고생하셨습니다!!',
            rating: 5,
            created_at: '2023-04-02T13:21:34.127Z',
          },
        ],
      },
    ];
    const createdScaleTeam = new this.scaleTeamModel(scaleTeamData[1]);
    return await createdScaleTeam.save();
    //const createdScaleTeams = await this.scaleTeamModel.insertMany(scaleTeamData);
    //return createdScaleTeams;
  }
}
