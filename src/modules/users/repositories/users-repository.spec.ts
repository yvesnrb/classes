import { Collection } from 'mongodb';

import UsersRepository from '@repositories/users-repository';
import User from '@entities/user-entity';
import mongoConfig from '@config/mongodb';
import mongoClient from '@/db';

let usersRepository: UsersRepository;
let usersCollection: Collection<User>;

const mockUser: User = {
  _id: 'mock-user-id',
  email: 'j.doe@mail.com',
  name: 'John Doe',
  password: 'pass',
  dateCreated: new Date('01-01-2021 13:00:00'),
  dateUpdated: new Date('01-01-2021 13:00:00'),
};

describe('UsersRepository', () => {
  beforeEach(async () => {
    usersRepository = new UsersRepository();
    usersCollection = mongoClient
      .db(mongoConfig.database)
      .collection<User>('users');
  });

  afterEach(async () => {
    await usersCollection.drop();
  });

  beforeAll(async () => {
    await mongoClient.connect();
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it('should find one user in the database', async () => {
    await usersCollection.insertOne(mockUser);

    const user = await usersRepository.find({ _id: 'mock-user-id' });

    expect(user).toMatchObject(mockUser);
  });

  it('should list many users in the database', async () => {
    const users = Array.from({ length: 50 }, (_, index) => ({
      ...mockUser,
      _id: `${index + 1}`,
      email: `${index + 1}@mail.com`,
    }));

    const partialUsers = Array.from({ length: 10 }, (_, index) => ({
      ...mockUser,
      _id: `${index + 1}`,
      email: `${index + 1}@mail.com`,
    }));

    await usersCollection.insertMany(users);

    const list = await usersRepository.list({ name: 'John Doe' }, 0, 10);

    expect(list).toEqual(
      expect.arrayContaining(
        partialUsers.map((user) => expect.objectContaining(user)),
      ),
    );
  });

  it('should save an user in the database', async () => {
    const user = new User('John Doe', 'j.doe@mail.com', 'pass');

    await usersRepository.save(user);

    const insertedUser = await usersCollection.findOne({
      email: 'j.doe@mail.com',
    });

    expect(insertedUser).toMatchObject({
      name: 'John Doe',
      email: 'j.doe@mail.com',
    });
  });

  it('should update a saved user', async () => {
    await usersCollection.insertOne(mockUser);

    await usersRepository.update({
      ...mockUser,
      email: 'updated@mail.com',
    });

    const updatedUser = await usersCollection.findOne({
      _id: 'mock-user-id',
    });

    expect(updatedUser).toMatchObject({
      ...mockUser,
      email: 'updated@mail.com',
    });
  });
});
