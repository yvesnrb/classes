import ListClassesService from '@services/list-classes-service';
import Class from '@entities/class-entity';
import Comment from '@entities/comment-entity';
import ClassesRepository from '@repositories/classes-repository';
import CommentsRepository from '@repositories/comments-repository';

let listClasses: ListClassesService;

const mockClass: Class = {
  _id: 'mock-class-id-1',
  name: 'Class 1',
  description: 'lorem ipsum dolorem sit amet',
  video: 'http://google.com',
  dateInit: new Date('01/01/2021 14:00:00'),
  dateEnd: new Date('01/02/2021 14:00:00'),
  dateCreated: new Date('01/01/2021 14:00:00'),
  dateUpdated: new Date('01/01/2021 14:00:00'),
};

const mockComment: Comment = {
  _id: 'mock-comment-id',
  classId: 'mock-class-id',
  comment: 'This is a mock comment.',
  dateCreated: new Date('01/01/2021 14:00:00.00Z'),
};

describe('ListClassesService', () => {
  beforeEach(() => {
    listClasses = new ListClassesService();
  });

  it('should list the classes', async () => {
    jest.spyOn(ClassesRepository.prototype, 'list').mockReturnValue(
      Promise.resolve([
        { ...mockClass, _id: 'mock-class-id-1' },
        { ...mockClass, _id: 'mock-class-id-2' },
        { ...mockClass, _id: 'mock-class-id-3' },
      ]),
    );

    jest
      .spyOn(CommentsRepository.prototype, 'list')
      .mockImplementation((filters) => {
        if (filters.classId === 'mock-class-id-1') {
          return Promise.resolve([mockComment]);
        }

        return Promise.resolve([]);
      });

    jest
      .spyOn(CommentsRepository.prototype, 'count')
      .mockImplementation((filters) => {
        if (filters.classId === 'mock-class-id-1') {
          return Promise.resolve(1);
        }

        return Promise.resolve(0);
      });

    const list = await listClasses.execute({});

    expect(list).toHaveLength(3);
    expect(list[0]).toMatchObject({
      ...mockClass,
      totalComments: 1,
      lastComment: 'This is a mock comment.',
      lastCommentDate: new Date('01/01/2021 14:00:00.00Z'),
    });
  });
});
