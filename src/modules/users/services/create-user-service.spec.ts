import CreateUserService from '@services/create-user-service';
import User from '@entities/user-entity';
import AppError from '@errors/app-error';

const mockSave = jest.fn().mockImplementation(() => ({
  _id: 'mock id',
  name: 'mock name',
  email: 'mock email',
  password: 'pass',
  date_created: new Date('2021-01-01 14:00:00'),
  date_updated: new Date('2021-01-01 14:00:00'),
}));

const mockFind = jest.fn().mockImplementation(() => null);

jest.mock('@repositories/users-repository', () => {
  return jest.fn().mockImplementation(() => {
    return {
      save: mockSave,
      find: mockFind,
    };
  });
});

jest.mock('@entities/user-entity', () => {
  return jest.fn().mockImplementation(() => ({
    _id: 'mock id',
    name: 'mock name',
    email: 'mock email',
    password: 'pass',
    date_created: new Date('2021-01-01 14:00:00'),
    date_updated: new Date('2021-01-01 14:00:00'),
  }));
});

describe('CreateUserService', () => {
  it('should create a new user', async () => {
    const createUser = new CreateUserService();

    const createdUser = await createUser.execute({
      name: 'John Doe',
      email: 'j.doe@mail.com',
      password: 'pass',
    });

    expect(mockFind).toHaveBeenCalledWith({ email: 'j.doe@mail.com' });
    expect(User).toHaveBeenCalledWith('John Doe', 'j.doe@mail.com', 'pass');
    expect(mockSave).toHaveBeenCalledWith({
      _id: 'mock id',
      name: 'mock name',
      email: 'mock email',
      password: 'pass',
      date_created: new Date('2021-01-01 14:00:00'),
      date_updated: new Date('2021-01-01 14:00:00'),
    });
    expect(createdUser).toMatchObject({
      _id: 'mock id',
      name: 'mock name',
      email: 'mock email',
      password: 'pass',
    });
  });

  it('should not create a duplicate user', async () => {
    const createUser = new CreateUserService();

    mockFind.mockImplementationOnce(() => ({
      _id: 'mock id',
      name: 'mock name',
      email: 'mock email',
      password: 'pass',
      date_created: new Date('2021-01-01 14:00:00'),
      date_updated: new Date('2021-01-01 14:00:00'),
    }));

    await expect(createUser.execute({
      name: 'mock name',
      email: 'mock email',
      password: 'pass',
    })).rejects.toThrowError(new AppError('duplicate email attempt', 409));
  });
});
