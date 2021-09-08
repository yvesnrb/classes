import ClassesRepository from '@repositories/classes-repository';
import Class from '@entities/class-entity';
import mongoClient from '@/db';

let classesRepository: ClassesRepository;

describe('UsersRepository', () => {
  beforeEach(async () => {
    classesRepository = new ClassesRepository();
  });

  afterEach(async () => {
    await classesRepository.collection.drop();
  });

  beforeAll(async () => {
    await mongoClient.connect();
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it('should find one class in the database', async () => {
    await classesRepository.collection.insertOne({
      _id: 'mock id',
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
      date_created: new Date(),
      date_updated: new Date(),
    });

    const user = await classesRepository.find({ _id: 'mock id' });

    expect(user).toMatchObject({
      _id: 'mock id',
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
    });
  });

  it('should list many classes in the database', async () => {
    const classes = Array.from({ length: 50 }, (_, index) => ({
      _id: `${index + 1}`,
      name: `Class ${index + 1}`,
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
      date_created: new Date(),
      date_updated: new Date(),
    }));

    const partialClasses = Array.from({ length: 10 }, (_, index) => ({
      _id: `${index + 1}`,
      name: `Class ${index + 1}`,
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
    }));

    await classesRepository.collection.insertMany(classes);

    const list = await classesRepository.list(
      { name: { $regex: 'Class' } },
      0,
      10,
    );

    expect(list).toEqual(
      expect.arrayContaining(
        partialClasses.map((myClass) => expect.objectContaining(myClass)),
      ),
    );
  });

  it('should save a class in the database', async () => {
    const myClass = new Class({
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
    });

    await classesRepository.save(myClass);

    const insertedClass = await classesRepository.collection.findOne({
      name: 'Class 1',
    });

    expect(insertedClass).toMatchObject({
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
    });
  });

  it('should update a saved class', async () => {
    await classesRepository.collection.insertOne({
      _id: 'mock id',
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
      date_created: new Date(),
      date_updated: new Date(),
    });

    await classesRepository.update({
      _id: 'mock id',
      name: 'New Title',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
      date_created: new Date(),
      date_updated: new Date(),
    });

    const updatedClass = await classesRepository.collection.findOne({
      _id: 'mock id',
    });

    expect(updatedClass).toMatchObject({
      _id: 'mock id',
      name: 'New Title',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
    });
  });
});
