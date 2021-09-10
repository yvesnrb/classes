import { ObjectId } from 'mongodb';
import MockDate from 'mockdate';

import Comment from '@entities/comment-entity';

describe('ClassEntity', () => {
  it('should create a new comment entity', () => {
    MockDate.set(new Date('01/01/2021 14:00:00.00Z'));

    const objectIdToHexStringSpy = jest
      .spyOn(ObjectId.prototype, 'toHexString')
      .mockReturnValue('mock-comment-id');

    const comment = new Comment('mock-class-id', 'This is a mock comment.');

    expect(objectIdToHexStringSpy).toHaveBeenCalled();

    expect(comment).toEqual({
      _id: 'mock-comment-id',
      classId: 'mock-class-id',
      comment: 'This is a mock comment.',
      dateCreated: new Date('01/01/2021 14:00:00.00Z'),
    });
  });
});
