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

    const listWithComments = await Promise.all(
      list.map(async (myClass) => {
        const lastComment = await this.commentsRepository.list(
          {
            id_class: myClass._id,
          },
          0,
          1,
        );

        const total_comments = await this.commentsRepository.collection.count({
          id_class: myClass._id,
        });

        return {
          ...myClass,
          last_comment: lastComment[0]?.comment || null,
          last_comment_date: lastComment[0]?.date_created || null,
          total_comments,
        };
      }),
    );

    return listWithComments;
  }
}
