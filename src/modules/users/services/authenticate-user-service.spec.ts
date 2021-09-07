import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import AuthenticateUserService from '@services/authenticate-user-service';
import AppError from '@errors/app-error';

const mockFind = jest.fn().mockImplementation(() => ({
  _id: 'mock id',
  name: 'John Doe',
  email: 'j.doe@mail.com',
  password: 'mock hash',
  date_created: new Date('2021-01-01 14:00:00'),
  date_updated: new Date('2021-01-01 14:00:00'),
}));

jest.mock('@repositories/users-repository', () => {
  return jest.fn().mockImplementation(() => {
    return {
      find: mockFind,
    };
  });
});

jest.mock('bcryptjs', () => {
  return {
    compareSync: jest.fn().mockImplementation(() => true),
  };
});

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn().mockImplementation(() => 'mock token'),
  };
});

jest.mock('@config/jwt', () => {
  return {
    secret: 'unsafe secret',
    expiration: '1h',
  };
});

describe('AuthenticateUserService', () => {
  it('should auth an user with the correct credentials', async () => {
    const authenticateUser = new AuthenticateUserService();

    const credentials = await authenticateUser.execute({
      email: 'j.doe@mail.com',
      password: 'pass',
    });

    expect(mockFind).toHaveBeenCalledWith({ email: 'j.doe@mail.com' });
    expect(bcrypt.compareSync).toHaveBeenCalledWith('pass', 'mock hash');
    expect(jwt.sign).toHaveBeenCalledWith({}, 'unsafe secret', {
      subject: 'mock id',
      expiresIn: '1h',
    });
    expect(credentials).toMatchObject({
      _id: 'mock id',
      name: 'John Doe',
      email: 'j.doe@mail.com',
      token: 'mock token',
    });
  });

  it('should not authenticate an user that is not registered', async () => {
    const authenticateUser = new AuthenticateUserService();
    mockFind.mockImplementationOnce(() => null);

    await expect(
      authenticateUser.execute({
        email: 'j.doe@mail.com',
        password: 'pass',
      }),
    ).rejects.toThrowError(new AppError('no email auth attempt', 403));
  });

  it('should not authenticate an user with the wrong password', async () => {
    const authenticateUser = new AuthenticateUserService();
    jest.spyOn(bcrypt, 'compareSync').mockImplementationOnce(() => false);

    await expect(
      authenticateUser.execute({
        email: 'j.doe@mail.com',
        password: 'pass',
      }),
    ).rejects.toThrowError(new AppError('wrong password auth attempt', 403));
  });
});
