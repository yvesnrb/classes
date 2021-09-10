import Class from '@entities/class-entity';
import Comment from '@entities/comment-entity';
import ClassesRepository from '@repositories/classes-repository';
import CommentsRepository from '@repositories/comments-repository';
import AppError from '@/errors/app-error';

interface IRequest {
  id: string;
}

interface IResponse extends Class {
  comments: Comment[];
  totalComments: number;
}

export default class CreateClassService {
  private classesRepository: ClassesRepository;

  private commentsRepository: CommentsRepository;

  constructor() {
    this.classesRepository = new ClassesRepository();
    this.commentsRepository = new CommentsRepository();
  }

  public async execute(request: IRequest): Promise<IResponse> {
    const { id } = request;
    const myClass = await this.classesRepository.find({ _id: id });

    if (!myClass) throw new AppError('class not found', 404);

    const comments = await this.commentsRepository.list({ classId: id }, 0, 3);
    const totalComments = await this.commentsRepository.count({
      classId: id,
    });

    return {
      ...myClass,
      comments,
      totalComments,
    };
  }
}
