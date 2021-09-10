import CreateUserService from '@services/create-user-service';
import User from '@entities/user-entity';
import UsersRepository from '@repositories/users-repository';
import AppError from '@errors/app-error';

let createUser: CreateUserService;

const mockUser: User = {
  _id: 'mock-user-id',
  name: 'John Doe',
  email: 'j.doe@mail.com',
  password: 'pass',
  dateCreated: new Date('2021-01-01 14:00:00'),
  dateUpdated: new Date('2021-01-01 14:00:00'),
};

jest.mock('@entities/user-entity', () =>
  jest.fn().mockImplementation(() => mockUser));

describe('CreateUserService', () => {
  beforeEach(() => {
    createUser = new CreateUserService();
  });

  it('should create a new user', async () => {
    const usersRepositoryFindSpy = jest
      .spyOn(UsersRepository.prototype, 'find')
      .mockReturnValue(Promise.resolve(null));

    const usersRepositorySaveSpy = jest
      .spyOn(UsersRepository.prototype, 'save')
      .mockReturnValue(Promise.resolve(undefined));

    const user = await createUser.execute({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(User).toHaveBeenCalledWith('John Doe', 'j.doe@mail.com', 'pass');
    expect(usersRepositoryFindSpy).toHaveBeenCalledWith({
      email: 'j.doe@mail.com',
    });
    expect(usersRepositorySaveSpy).toHaveBeenCalledWith(mockUser);
    expect(user).toMatchObject({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    });
  });

  it('should not create a duplicate user', async () => {
    const usersRepositoryFindSpy = jest
      .spyOn(UsersRepository.prototype, 'find')
      .mockReturnValue(Promise.resolve(mockUser));

    await expect(createUser.execute({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    })).rejects.toThrowError(new AppError('duplicate email attempt', 409));
    expect(usersRepositoryFindSpy).toHaveBeenCalledWith({
      email: mockUser.email,
    });
  });
});
