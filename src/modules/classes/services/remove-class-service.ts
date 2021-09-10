import ClassesRepository from '@repositories/classes-repository';
import AppError from '@/errors/app-error';

interface IRequest {
  id: string;
}

export default class RemoveClassService {
  private classesRepository: ClassesRepository;

  constructor() {
    this.classesRepository = new ClassesRepository();
  }

  public async execute(request: IRequest): Promise<void> {
    const { id } = request;
    const myClass = await this.classesRepository.find({ _id: id });

    if (!myClass) throw new AppError('class not found', 404);

    await this.classesRepository.remove(myClass._id);
  }
}
