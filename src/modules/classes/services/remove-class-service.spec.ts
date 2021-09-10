import Class from '@entities/class-entity';
import RemoveClassService from '@services/remove-class-service';
import ClassesRepository from '@repositories/classes-repository';
import AppError from '@errors/app-error';

let removeClass: RemoveClassService;

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

describe('RemoveClassService', () => {
  beforeEach(() => {
    removeClass = new RemoveClassService();
  });

  it('should remove a class by its ID', async () => {
    const classesRepositoryFindSpy = jest
      .spyOn(ClassesRepository.prototype, 'find')
      .mockReturnValue(Promise.resolve(mockClass));

    const classesRepositoryRemoveSpy = jest
      .spyOn(ClassesRepository.prototype, 'remove')
      .mockReturnValue(Promise.resolve(undefined));

    await removeClass.execute({ id: 'mock-class-id' });

    expect(classesRepositoryFindSpy).toHaveBeenCalledWith({
      _id: 'mock-class-id',
    });
    expect(classesRepositoryRemoveSpy).toHaveBeenCalledWith('mock-class-id');
  });

  it('should throw an error if there is no class by this ID', async () => {
    const classesRepositoryFindSpy = jest
      .spyOn(ClassesRepository.prototype, 'find')
      .mockReturnValue(Promise.resolve(null));

    await expect(
      removeClass.execute({ id: 'mock-class-id' }),
    ).rejects.toThrowError(new AppError('class not found', 404));
    expect(classesRepositoryFindSpy).toHaveBeenCalledWith({
      _id: 'mock-class-id',
    });
  });
});
