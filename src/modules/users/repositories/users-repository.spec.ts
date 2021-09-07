import UsersRepository from '@repositories/users-repository';
import User from '@entities/user-entity';
import mongoClient from '@/db';

let usersRepository: UsersRepository;

describe('UsersRepository', () => {
  beforeEach(async () => {
    usersRepository = new UsersRepository();
  });

  afterEach(async () => {
    await usersRepository.collection.drop();
  });

  beforeAll(async () => {
    await mongoClient.connect();
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it('should find one user in the database', async () => {
    await usersRepository.collection.insertOne({
      _id: 'mock id',
      email: 'j.doe@mail.com',
      name: 'John Doe',
      password: 'pass',
      date_created: new Date(),
      date_updated: new Date(),
    });

    const user = await usersRepository.find({ _id: 'mock id' });

    expect(user).toMatchObject({
      _id: 'mock id',
      email: 'j.doe@mail.com',
      name: 'John Doe',
      password: 'pass',
    });
  });

  it('should list many users in the database', async () => {
    const users = Array.from({ length: 50 }, (_, index) => ({
      _id: `${index + 1}`,
      name: `User ${index + 1}`,
      email: `${index + 1}@mail.com`,
      password: 'pass',
      date_created: new Date(),
      date_updated: new Date(),
    }));

    const partialUsers = Array.from({ length: 10 }, (_, index) => ({
      _id: `${index + 1}`,
      name: `User ${index + 1}`,
      email: `${index + 1}@mail.com`,
      password: 'pass',
    }));

    await usersRepository.collection.insertMany(users);

    const list = await usersRepository.list({ password: 'pass' }, 0, 10);

    expect(list).toEqual(
      expect.arrayContaining(
        partialUsers.map((user) => expect.objectContaining(user)),
      ),
    );
  });

  it('should save an user in the database', async () => {
    const user = new User('John Doe', 'j.doe@mail.com', 'senha');

    await usersRepository.save(user);

    const insertedUser = await usersRepository.collection.findOne({
      email: 'j.doe@mail.com',
    });

    expect(insertedUser).toMatchObject({
      name: 'John Doe',
      email: 'j.doe@mail.com',
    });
  });

  it('should update a saved user', async () => {
    await usersRepository.collection.insertOne({
      _id: 'mock id',
      email: 'j.doe@mail.com',
      name: 'John Doe',
      password: 'pass',
      date_created: new Date(),
      date_updated: new Date(),
    });

    await usersRepository.update({
      _id: 'mock id',
      email: 'updated@mail.com',
      name: 'John Updated',
      password: 'pass',
      date_created: new Date(),
      date_updated: new Date(),
    });

    const updatedUser = await usersRepository.collection.findOne({
      _id: 'mock id',
    });

    expect(updatedUser).toMatchObject({
      _id: 'mock id',
      email: 'updated@mail.com',
      name: 'John Updated',
      password: 'pass',
    });
  });
});
