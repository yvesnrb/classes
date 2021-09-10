import { Collection } from 'mongodb';

import ClassesRepository from '@repositories/classes-repository';
import Class from '@entities/class-entity';
import mongoConfig from '@config/mongodb';
import mongoClient from '@/db';

let classesRepository: ClassesRepository;
let classesCollection: Collection<Class>;

const mockClass: Class = {
  _id: 'mock-class-id',
  name: 'Class 1',
  description: 'lorem ipsum dolorem sit amet',
  video: 'http://google.com',
  dateInit: new Date('01/01/2021 14:00:00'),
  dateEnd: new Date('01/02/2021 14:00:00'),
  dateCreated: new Date('01/01/2021 14:00:00'),
  dateUpdated: new Date('01/01/2021 14:00:00'),
};

describe('UsersRepository', () => {
  beforeEach(async () => {
    classesRepository = new ClassesRepository();
    classesCollection = mongoClient
      .db(mongoConfig.database)
      .collection<Class>('classes');
  });

  afterEach(async () => {
    await classesCollection.drop();
  });

  beforeAll(async () => {
    await mongoClient.connect();
  });

  afterAll(async () => {
    await mongoClient.close();
  });

  it('should find one class in the database', async () => {
    await classesCollection.insertOne(mockClass);

    const myClass = await classesRepository.find({ _id: 'mock-class-id' });

    expect(myClass).toMatchObject({
      _id: 'mock-class-id',
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      dateInit: new Date('01/01/2021 14:00:00'),
      dateEnd: new Date('01/02/2021 14:00:00'),
    });
  });

  it('should list many classes in the database', async () => {
    const classes = Array.from({ length: 50 }, (_, index) => ({
      ...mockClass,
      _id: `${index + 1}`,
      name: `Class ${index + 1}`,
    }));

    const partialClasses = Array.from({ length: 10 }, (_, index) => ({
      ...mockClass,
      _id: `${index + 1}`,
      name: `Class ${index + 1}`,
    }));

    await classesCollection.insertMany(classes);

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
      dateInit: new Date('01/01/2021 14:00:00'),
      dateEnd: new Date('01/02/2021 14:00:00'),
    });

    await classesRepository.save(myClass);

    const insertedClass = await classesCollection.findOne({
      name: 'Class 1',
    });

    expect(insertedClass).toMatchObject({
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      dateInit: new Date('01/01/2021 14:00:00'),
      dateEnd: new Date('01/02/2021 14:00:00'),
    });
  });

  it('should update a saved class', async () => {
    await classesCollection.insertOne(mockClass);

    await classesRepository.update({
      ...mockClass,
      description: 'Updated description.',
    });

    const updatedClass = await classesCollection.findOne({
      _id: 'mock-class-id',
    });

    expect(updatedClass).toMatchObject({
      ...mockClass,
      description: 'Updated description.',
    });
  });

  it('should remove a saved class', async () => {
    await classesCollection.insertOne(mockClass);
    let myClass: Class | null = null;

    myClass = await classesCollection.findOne({ _id: 'mock-class-id' });

    expect(myClass).not.toBeNull();

    await classesRepository.remove('mock-class-id');

    myClass = await classesCollection.findOne({ _id: 'mock-class-id' });

    expect(myClass).toBeNull();
  });
});
