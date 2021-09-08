import Class from '@entities/class-entity';
import ClassesRepository from '@repositories/classes-repository';
import CommentsRepository from '@repositories/comments-repository';

interface IRequest {
  name?: string;
  description?: string;
  data_init?: Date;
  data_end?: Date;
  page?: number;
}

interface IResponse extends Class {
  total_comments: number;
  last_comment: string | null;
  last_comment_date: Date | null;
}

export default class CreateClassService {
  private classesRepository: ClassesRepository;

  private commentsRepository: CommentsRepository;

  constructor() {
    this.classesRepository = new ClassesRepository();
    this.commentsRepository = new CommentsRepository();
  }

  public async execute(request: IRequest): Promise<IResponse[]> {
    const {
      name,
      description,
      data_init,
      data_end,
      page = 0,
    } = request;
    const skip = page * 50;

    const list = await this.classesRepository.list({
      name,
      description,
      data_init,
      data_end,
    }, skip, 50);

    const lastComments = await Promise.all(
      Array.from({ length: list.length }, async (_, index) => {
        const lastComment = await this.commentsRepository.list(
          {
            id_class: list[index]._id,
          },
          0,
          1,
        );

        const total_comments = await this.commentsRepository.collection.count({
          id_class: list[index]._id,
        });

        if (lastComment.length === 0) {
          return {
            last_comment: null,
            last_comment_date: null,
            total_comments,
          };
        }

        return {
          last_comment: lastComment[0].comment,
          last_comment_date: lastComment[0].date_created,
          total_comments,
        };
      }),
    );

    const response = Array.from({ length: list.length }, (_, index) => {
      return {
        ...list[index],
        total_comments: lastComments[index].total_comments,
        last_comment: lastComments[index].last_comment,
        last_comment_date: lastComments[index].last_comment_date,
      };
    });

    return response;
  }
}
