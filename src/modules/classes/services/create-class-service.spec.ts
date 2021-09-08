import CreateClassService from '@services/create-class-service';
import Class from '@entities/class-entity';
import AppError from '@errors/app-error';

const mockSave = jest.fn().mockImplementation(() => ({
  _id: 'mock guid',
  name: 'Class 1',
  description: 'lorem ipsum dolorem sit amet',
  video: 'http://google.com',
  data_init: new Date('01/01/2021 14:00:00'),
  data_end: new Date('01/02/2021 14:00:00'),
  date_created: new Date('01/01/2021 14:00:00.00Z'),
  date_updated: new Date('01/01/2021 14:00:00.00Z'),
}));

const mockFind = jest.fn().mockImplementation(() => null);

jest.mock('@repositories/classes-repository', () => {
  return jest.fn().mockImplementation(() => {
    return {
      save: mockSave,
      find: mockFind,
    };
  });
});

jest.mock('@entities/class-entity', () => {
  return jest.fn().mockImplementation(() => ({
    _id: 'mock guid',
    name: 'Class 1',
    description: 'lorem ipsum dolorem sit amet',
    video: 'http://google.com',
    data_init: new Date('01/01/2021 14:00:00'),
    data_end: new Date('01/02/2021 14:00:00'),
    date_created: new Date('01/01/2021 14:00:00.00Z'),
    date_updated: new Date('01/01/2021 14:00:00.00Z'),
  }));
});

describe('CreateUserService', () => {
  it('should create a new class', async () => {
    const createClass = new CreateClassService();

    const myClass = await createClass.execute({
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
    });

    expect(mockFind).toHaveBeenCalledWith({ name: 'Class 1' });
    expect(Class).toHaveBeenCalledWith({
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
    });
    expect(mockSave).toHaveBeenCalledWith({
      _id: 'mock guid',
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
      date_created: new Date('01/01/2021 14:00:00.00Z'),
      date_updated: new Date('01/01/2021 14:00:00.00Z'),
    });
    expect(myClass).toEqual({
      _id: 'mock guid',
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
      date_created: new Date('01/01/2021 14:00:00.00Z'),
      date_updated: new Date('01/01/2021 14:00:00.00Z'),
      total_comments: 0,
    });
  });

  it('should not create a duplicate class', async () => {
    const createClass = new CreateClassService();

    mockFind.mockImplementationOnce(() => ({
      _id: 'mock guid',
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
      date_created: new Date('01/01/2021 14:00:00.00Z'),
      date_updated: new Date('01/01/2021 14:00:00.00Z'),
    }));

    await expect(createClass.execute({
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
    })).rejects.toThrowError(new AppError('duplicate class name attempt', 409));
  });
});
