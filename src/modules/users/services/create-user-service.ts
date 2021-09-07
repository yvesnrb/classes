import User from '@entities/user-entity';
import UsersRepository from '@repositories/users-repository';
import AppError from '@errors/app-error';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  public async execute(request: IRequest): Promise<User> {
    const { name, email, password } = request;
    const sameEmailUser = await this.usersRepository.find({ email });

    if (sameEmailUser) {
      throw new AppError('duplicate email attempt', 409);
    }

    const user = new User(name, email, password);
    await this.usersRepository.save(user);

    return user;
  }
}
