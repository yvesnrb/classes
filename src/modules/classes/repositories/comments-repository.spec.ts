import { Collection } from 'mongodb';

import CommentsRepository from '@repositories/comments-repository';
import Comment from '@entities/comment-entity';
import mongoConfig from '@config/mongodb';
import mongoClient from '@/db';

let commentsRepository: CommentsRepository;
let commentsCollection: Collection<Comment>;

const mockComment: Comment = {
  _id: 'mock-comment-id',
  classId: 'mock-class-id',
  comment: 'this is a mock comment',
  dateCreated: new Date('01/01/2021 14:00:00.00Z'),
};

describe('UsersRepository', () => {
  beforeEach(async () => {
    commentsRepository = new CommentsRepository();
    commentsCollection = mongoClient
      .db(mongoConfig.database)
      .collection<Comment>('comments');
  });

  afterEach(async () => {
    await commentsCollection.drop();
  });

  beforeAll(async () => {
    await mongoClient.connect();
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it('should count the documents in the database', async () => {
    await commentsCollection.insertMany([
      { ...mockComment, _id: 'mock-comment-id-1' },
      { ...mockComment, _id: 'mock-comment-id-2' },
    ]);

    const count = await commentsRepository.count({});

    expect(count).toStrictEqual(2);
  });

  it('should find one comment in the database', async () => {
    await commentsCollection.insertOne(mockComment);

    const comment = await commentsRepository.find({ _id: 'mock-comment-id' });

    expect(comment).toMatchObject(mockComment);
  });

  it('should list many comments in the database', async () => {
    const comments = Array.from({ length: 50 }, (_, index) => ({
      ...mockComment,
      _id: `${index + 1}`,
    }));

    const partialComments = Array.from({ length: 10 }, (_, index) => ({
      ...mockComment,
      _id: `${index + 1}`,
    }));

    await commentsCollection.insertMany(comments);

    const list = await commentsRepository.list(
      { classId: 'mock-class-id' },
      0,
      10,
    );

    expect(list).toEqual(
      expect.arrayContaining(
        partialComments.map((comment) => expect.objectContaining(comment)),
      ),
    );
  });

  it('should save a comment in the database', async () => {
    const comment = new Comment('mock-class-id', 'This is a mock comment.');

    await commentsRepository.save(comment);

    const insertedComment = await commentsCollection.findOne({
      classId: 'mock-class-id',
    });

    expect(insertedComment).toMatchObject({
      classId: 'mock-class-id',
      comment: 'This is a mock comment.',
    });
  });

  it('should update a saved comment', async () => {
    await commentsCollection.insertOne(mockComment);

    await commentsRepository.update({
      ...mockComment,
      comment: 'This is an updated comment.',
    });

    const updatedComment = await commentsCollection.findOne({
      _id: 'mock-comment-id',
    });

    expect(updatedComment).toMatchObject({
      ...mockComment,
      comment: 'This is an updated comment.',
    });
  });
});
