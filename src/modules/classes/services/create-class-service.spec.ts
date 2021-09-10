import CreateClassService from '@services/create-class-service';
import Class from '@entities/class-entity';
import ClassesRepository from '@repositories/classes-repository';
import AppError from '@errors/app-error';

let createClass: CreateClassService;

const mockClass: Class = {
  _id: 'mock-class-id',
  name: 'Class 1',
  description: 'lorem ipsum dolorem sit amet',
  video: 'http://google.com',
  dateInit: new Date('01/01/2021 14:00:00'),
  dateEnd: new Date('01/02/2021 14:00:00'),
  dateCreated: new Date('01/01/2021 14:00:00.00Z'),
  dateUpdated: new Date('01/01/2021 14:00:00.00Z'),
};

jest.mock('@entities/class-entity', () =>
  jest.fn().mockImplementation(() => mockClass));

describe('CreateUserService', () => {
  beforeEach(() => {
    createClass = new CreateClassService();
  });

  it('should create a new class', async () => {
    const classesRepositoryFindSpy = jest
      .spyOn(ClassesRepository.prototype, 'find')
      .mockReturnValue(Promise.resolve(null));

    const classesRepositorySaveSpy = jest
      .spyOn(ClassesRepository.prototype, 'save')
      .mockReturnValue(Promise.resolve(undefined));

    const myClass = await createClass.execute({
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      dateInit: new Date('01/01/2021 14:00:00'),
      dateEnd: new Date('01/02/2021 14:00:00'),
    });

    expect(classesRepositoryFindSpy).toHaveBeenCalledWith({ name: 'Class 1' });
    expect(Class).toHaveBeenCalledWith({
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      dateInit: new Date('01/01/2021 14:00:00'),
      dateEnd: new Date('01/02/2021 14:00:00'),
    });
    expect(classesRepositorySaveSpy).toHaveBeenCalledWith(mockClass);
    expect(myClass).toEqual({
      ...mockClass,
      totalComments: 0,
    });
  });

  it('should not create a duplicate class', async () => {
    const classesRepositoryFindSpy = jest
      .spyOn(ClassesRepository.prototype, 'find')
      .mockReturnValue(Promise.resolve(mockClass));

    await expect(createClass.execute({
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      dateInit: new Date('01/01/2021 14:00:00'),
      dateEnd: new Date('01/02/2021 14:00:00'),
    })).rejects.toThrowError(new AppError('duplicate class name attempt', 409));
    expect(classesRepositoryFindSpy).toHaveBeenCalledWith({ name: 'Class 1' });
  });
});
