import ListClassesService from '@services/list-classes-service';
import Class from '@entities/class-entity';

const mockClassesList = jest.fn().mockImplementation(() =>
  Array.from({ length: 3 }, (_, index) => ({
    _id: `${index + 1}`,
    name: `Class ${index + 1}`,
    description: 'lorem ipsum dolorem sit amet',
    video: 'http://google.com',
    data_init: new Date('01/01/2021 14:00:00'),
    data_end: new Date('01/02/2021 14:00:00'),
    date_created: new Date(),
    date_updated: new Date(),
  })));

jest.mock('@repositories/classes-repository', () => {
  return jest.fn().mockImplementation(() => {
    return {
      list: mockClassesList,
    };
  });
});

const mockCommentsList = jest.fn().mockImplementation((filters) => {
  if (filters.id_class === '1') {
    return [{
      _id: 'mock guid',
      id_class: 'mock class id',
      comment: 'this is a mock comment',
      date_created: new Date('01/01/2021 14:00:00.00Z'),
    }];
  }

  return [];
});

const mockCount = jest.fn().mockImplementation((filters) => {
  if (filters.id_class === '1') {
    return 1;
  }

  return 0;
});

jest.mock('@repositories/comments-repository', () => {
  return jest.fn().mockImplementation(() => {
    return {
      list: mockCommentsList,
      collection: {
        count: mockCount,
      },
    };
  });
});

describe('ListClassesService', () => {
  it('should list the classes', async () => {
    const listClasses = new ListClassesService();

    const list = await listClasses.execute({});

    expect(list).toHaveLength(3);
    expect(list[0]).toMatchObject({
      _id: '1',
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
      total_comments: 1,
      last_comment: 'this is a mock comment',
      last_comment_date: new Date('01/01/2021 14:00:00.00Z'),
    });
  });
});
