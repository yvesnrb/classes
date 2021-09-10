import FindClassService from '@services/find-class-service';
import Class from '@entities/class-entity';
import Comment from '@entities/comment-entity';
import ClassesRepository from '@repositories/classes-repository';
import CommentsRepository from '@repositories/comments-repository';
import AppError from '@errors/app-error';

let findClass: FindClassService;

const mockClass: Class = {
  _id: 'mock-class-id',
  name: 'Class 1',
  description: 'lorem ipsum dolorem sit amet',
  video: 'http://google.com',
  data_init: new Date('01/01/2021 14:00:00'),
  data_end: new Date('01/02/2021 14:00:00'),
  date_created: new Date('01/01/2021 14:00:00.00Z'),
  date_updated: new Date('01/01/2021 14:00:00.00Z'),
};

const mockComment: Comment = {
  _id: 'mock-comment-id',
  id_class: 'mock-class-id',
  comment: 'this is a mock comment',
  date_created: new Date('01/01/2021 14:00:00.00Z'),
};

describe('FindClassService', () => {
  beforeEach(() => {
    findClass = new FindClassService();
  });

  it('should find a single class by its ID', async () => {
    const classesRepositoryFindSpy = jest
      .spyOn(ClassesRepository.prototype, 'find')
      .mockReturnValue(Promise.resolve(mockClass));

    const commentsRepositoryListSpy = jest
      .spyOn(CommentsRepository.prototype, 'list')
      .mockReturnValue(Promise.resolve([mockComment]));

    const commentsRepositoryCountSpy = jest
      .spyOn(CommentsRepository.prototype, 'count')
      .mockReturnValue(Promise.resolve(1));

    const myClass = await findClass.execute({ id: 'mock-class-id' });

    expect(myClass).toStrictEqual({
      ...mockClass,
      comments: [mockComment],
      total_comments: 1,
    });
    expect(classesRepositoryFindSpy).toHaveBeenCalledWith({
      _id: 'mock-class-id',
    });
    expect(commentsRepositoryListSpy).toHaveBeenCalledWith(
      {
        id_class: 'mock-class-id',
      },
      0,
      3,
    );
    expect(commentsRepositoryCountSpy).toHaveBeenCalledWith({
      id_class: 'mock-class-id',
    });
  });

  it('should throw an error if there is no class by this ID', async () => {
    const classesRepositoryFindSpy = jest
      .spyOn(ClassesRepository.prototype, 'find')
      .mockReturnValue(Promise.resolve(null));

    await expect(
      findClass.execute({ id: 'mock-class-id' }),
    ).rejects.toThrowError(new AppError('class not found', 404));
    expect(classesRepositoryFindSpy).toHaveBeenCalledWith({
      _id: 'mock-class-id',
    });
  });
});
