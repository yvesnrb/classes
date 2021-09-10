import Class from '@entities/class-entity';
import ClassesRepository from '@repositories/classes-repository';
import AppError from '@errors/app-error';

interface IRequest {
  name: string;
  description: string;
  video: string;
  dateInit: Date;
  dateEnd: Date;
}

interface IResponse extends Class {
  totalComments: number;
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
      dateInit,
      dateEnd,
    } = request;
    const sameNameClass = await this.classesRepository.find({ name });

    if (sameNameClass) {
      throw new AppError('duplicate class name attempt', 409);
    }

    const myClass = new Class({
      name,
      description,
      video,
      dateInit,
      dateEnd,
    });
    await this.classesRepository.save(myClass);

    return {
      ...myClass,
      totalComments: 0,
    };
  }
}
