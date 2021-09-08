import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UsersRepository from '@repositories/users-repository';
import AppError from '@errors/app-error';
import jwtConfig from '@config/jwt';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export default class AuthenticateUserService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  public async execute(request: IRequest): Promise<IResponse> {
    const { email, password } = request;
    const { secret, expiration } = jwtConfig;
    const user = await this.usersRepository.find({ email });

    if (!user) {
      throw new AppError('no email auth attempt', 403);
    }

    const isCorrectPassword = bcrypt.compareSync(password, user.password);

    if (!isCorrectPassword) {
      throw new AppError('wrong password auth attempt', 403);
    }

    const token = jwt.sign({}, secret, {
      subject: user._id.toString(),
      expiresIn: expiration,
    });

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    };
  }
}
