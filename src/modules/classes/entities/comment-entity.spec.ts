import { ObjectId } from 'mongodb';
import MockDate from 'mockdate';

import Comment from '@entities/comment-entity';

MockDate.set(new Date('01/01/2021 14:00:00.00Z'));

const toHexString = jest.fn().mockImplementation(() => 'mock guid');

jest.mock('mongodb', () => {
  return {
    ObjectId: jest.fn().mockImplementation(() => {
      return {
        toHexString,
      };
    }),
  };
});

describe('ClassEntity', () => {
  it('should create a new comment entity', () => {
    const comment = new Comment('mock class id', 'this is a mock comment');

    expect(ObjectId).toHaveBeenCalled();

    expect(comment).toEqual({
      _id: 'mock guid',
      id_class: 'mock class id',
      comment: 'this is a mock comment',
      date_created: new Date('01/01/2021 14:00:00.00Z'),
    });
  });
});
