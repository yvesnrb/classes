import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import AuthenticateUserService from '@services/authenticate-user-service';
import UsersRepository from '@repositories/users-repository';
import User from '@entities/user-entity';
import AppError from '@errors/app-error';

let authenticateUser: AuthenticateUserService;

const mockUser: User = {
  _id: 'mock-user-id',
  name: 'John Doe',
  email: 'j.doe@mail.com',
  password: 'mock-hash',
  dateCreated: new Date('2021-01-01 14:00:00'),
  dateUpdated: new Date('2021-01-01 14:00:00'),
};

jest.mock('@config/jwt', () => ({
  secret: 'unsafe secret',
  expiration: '1h',
}));

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    authenticateUser = new AuthenticateUserService();
  });

  it('should auth an user with the correct credentials', async () => {
    const usersRepositoryFindSpy = jest
      .spyOn(UsersRepository.prototype, 'find')
      .mockReturnValue(Promise.resolve(mockUser));

    const bcryptCompareSyncSpy = jest
      .spyOn(bcrypt, 'compareSync')
      .mockReturnValue(true);

    const jwtSignSpy = jest
      .spyOn(jwt, 'sign')
      .mockReturnValue('mock-token' as unknown as any);

    const credentials = await authenticateUser.execute({
      email: 'j.doe@mail.com',
      password: 'pass',
    });

    expect(usersRepositoryFindSpy).toHaveBeenCalledWith({
      email: 'j.doe@mail.com',
    });
    expect(bcryptCompareSyncSpy).toHaveBeenCalledWith(
      'pass',
      'mock-hash',
    );
    expect(jwtSignSpy).toHaveBeenCalledWith({}, 'unsafe secret', {
      subject: 'mock-user-id',
      expiresIn: '1h',
    });
    expect(credentials).toMatchObject({
      _id: 'mock-user-id',
      name: 'John Doe',
      email: 'j.doe@mail.com',
      token: 'mock-token',
    });
  });

  it('should not authenticate an user that is not registered', async () => {
    const usersRepositoryFindSpy = jest
      .spyOn(UsersRepository.prototype, 'find')
      .mockReturnValue(Promise.resolve(null));

    await expect(
      authenticateUser.execute({
        email: 'j.doe@mail.com',
        password: 'pass',
      }),
    ).rejects.toThrowError(new AppError('no email auth attempt', 403));
    expect(usersRepositoryFindSpy).toHaveBeenCalledWith({
      email: 'j.doe@mail.com',
    });
  });

  it('should not authenticate an user with the wrong password', async () => {
    const usersRepositoryFindSpy = jest
      .spyOn(UsersRepository.prototype, 'find')
      .mockReturnValue(Promise.resolve(mockUser));

    const bcryptCompareSyncSpy = jest
      .spyOn(bcrypt, 'compareSync')
      .mockReturnValue(false);

    await expect(
      authenticateUser.execute({
        email: 'j.doe@mail.com',
        password: 'pass',
      }),
    ).rejects.toThrowError(new AppError('wrong password auth attempt', 403));
    expect(usersRepositoryFindSpy).toHaveBeenCalledWith({
      email: 'j.doe@mail.com',
    });
    expect(bcryptCompareSyncSpy).toHaveBeenCalledWith('pass', 'mock-hash');
  });
});
