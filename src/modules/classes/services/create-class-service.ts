import Class from '@entities/class-entity';
import ClassesRepository from '@repositories/classes-repository';
import AppError from '@errors/app-error';

interface IRequest {
  name: string;
  description: string;
  video: string;
  data_init: Date;
  data_end: Date;
}

interface IResponse extends Class {
  total_comments: number;
}

export default class CreateClassService {
  private classesRepository: ClassesRepository;

  constructor() {
    this.classesRepository = new ClassesRepository();
  }

  public async execute(request: IRequest): Promise<IResponse> {
    const {
      name,
      description,
      video,
      data_init,
      data_end,
    } = request;
    const sameNameClass = await this.classesRepository.find({ name });

    if (sameNameClass) {
      throw new AppError('duplicate class name attempt', 409);
    }

    const myClass = new Class({
      name,
      description,
      video,
      data_init,
      data_end,
    });
    await this.classesRepository.save(myClass);

    return {
      ...myClass,
      total_comments: 0,
    };
  }
}
