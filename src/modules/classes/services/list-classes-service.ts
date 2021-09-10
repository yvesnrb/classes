import Class from '@entities/class-entity';
import ClassesRepository from '@repositories/classes-repository';
import CommentsRepository from '@repositories/comments-repository';

interface IRequest {
  name?: string;
  description?: string;
  dateInit?: Date;
  dateEnd?: Date;
  page?: number;
}

interface IResponse extends Class {
  totalComments: number;
  lastComment: string | null;
  lastCommentDate: Date | null;
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
      dateInit,
      dateEnd,
      page = 0,
    } = request;
    const skip = page * 50;

    const list = await this.classesRepository.list({
      name,
      description,
      dateInit,
      dateEnd,
    }, skip, 50);

    const listWithComments = await Promise.all(
      list.map(async (myClass) => {
        const lastComment = await this.commentsRepository.list(
          {
            classId: myClass._id,
          },
          0,
          1,
        );

        const totalComments = await this.commentsRepository.count({
          classId: myClass._id,
        });

        return {
          ...myClass,
          lastComment: lastComment[0]?.comment || null,
          lastCommentDate: lastComment[0]?.dateCreated || null,
          totalComments,
        };
      }),
    );

    return listWithComments;
  }
}
