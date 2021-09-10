import CommentsRepository from '@repositories/comments-repository';
import Comment from '@entities/comment-entity';
import mongoClient from '@/db';

let commentsRepository: CommentsRepository;

describe('UsersRepository', () => {
  beforeEach(async () => {
    commentsRepository = new CommentsRepository();
  });

  afterEach(async () => {
    await commentsRepository.collection.drop();
  });

  beforeAll(async () => {
    await mongoClient.connect();
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it('should count the documents in the database', async () => {
    await commentsRepository.collection.insertMany([
      {
        _id: 'mock-comment-id-1',
        id_class: 'mock-class-id',
        comment: 'this is a mock comment',
        date_created: new Date('01/01/2021 14:00:00.00Z'),
      },
      {
        _id: 'mock-comment-id-2',
        id_class: 'mock-class-id',
        comment: 'this is another comment',
        date_created: new Date('01/01/2021 14:00:00.00Z'),
      },
    ]);

    const count = await commentsRepository.count({});

    expect(count).toStrictEqual(2);
  });

  it('should find one comment in the database', async () => {
    await commentsRepository.collection.insertOne({
      _id: 'mock guid',
      id_class: 'mock class id',
      comment: 'this is a mock comment',
      date_created: new Date('01/01/2021 14:00:00.00Z'),
    });

    const comment = await commentsRepository.find({ _id: 'mock guid' });

    expect(comment).toMatchObject({
      _id: 'mock guid',
      id_class: 'mock class id',
      comment: 'this is a mock comment',
      date_created: new Date('01/01/2021 14:00:00.00Z'),
    });
  });

  it('should list many comments in the database', async () => {
    const comments = Array.from({ length: 50 }, (_, index) => ({
      _id: `${index + 1}`,
      id_class: 'mock class id',
      comment: 'this is a mock comment',
      date_created: new Date('01/01/2021 14:00:00.00Z'),
    }));

    const partialComments = Array.from({ length: 10 }, (_, index) => ({
      _id: `${index + 1}`,
      id_class: 'mock class id',
      comment: 'this is a mock comment',
    }));

    await commentsRepository.collection.insertMany(comments);

    const list = await commentsRepository.list(
      { id_class: 'mock class id' },
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
    const comment = new Comment('mock class id', 'this is a mock comment');

    await commentsRepository.save(comment);

    const insertedComment = await commentsRepository.collection.findOne({
      id_class: 'mock class id',
    });

    expect(insertedComment).toMatchObject({
      id_class: 'mock class id',
      comment: 'this is a mock comment',
    });
  });

  it('should update a saved comment', async () => {
    await commentsRepository.collection.insertOne({
      _id: 'mock guid',
      id_class: 'mock class id',
      comment: 'this is a mock comment',
      date_created: new Date('01/01/2021 14:00:00.00Z'),
    });

    await commentsRepository.update({
      _id: 'mock guid',
      id_class: 'mock class id',
      comment: 'this is an updated comment',
      date_created: new Date('01/01/2021 14:00:00.00Z'),
    });

    const updatedComment = await commentsRepository.collection.findOne({
      _id: 'mock guid',
    });

    expect(updatedComment).toMatchObject({
      _id: 'mock guid',
      id_class: 'mock class id',
      comment: 'this is an updated comment',
      date_created: new Date('01/01/2021 14:00:00.00Z'),
    });
  });
});
