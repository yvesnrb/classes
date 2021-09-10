import { Collection, Filter } from 'mongodb';

import Class from '@entities/class-entity';
import mongoConfig from '@config/mongodb';
import mongoClient from '@/db';

export default class ClassesRepository {
  private collection: Collection<Class>;

  constructor() {
    this.collection = mongoClient
      .db(mongoConfig.database)
      .collection<Class>('classes');
  }

  /**
   * Find one class in the database.
   *
   * @param filters - MongoDB filters for the Class entity.
   *
   * @returns The class if found, null otherwise.
   */
  public async find(filters: Filter<Class>): Promise<Class | null> {
    await mongoClient.connect();
    const myClass = await this.collection.findOne(filters);

    return myClass;
  }

  /**
   * Lists many classes from the database.
   *
   * @param filters - MongoDB filters for the Class entity.
   *
   * @param skip - Skip this many documents in the list.
   *
   * @param limit - Limit the list size to this many documents.
   *
   * @returns An array of classes.
   */
  public async list(
    filters: Filter<Class>,
    skip: number,
    limit: number,
  ): Promise<Class[]> {
    await mongoClient.connect();
    const list = this.collection
      .find(filters)
      .limit(limit)
      .skip(skip)
      .toArray();

    return list;
  }

  /**
   * Save a new class entity to the database.
   *
   * @param myClass - The class entity to save.
   */
  public async save(myClass: Class): Promise<void> {
    await mongoClient.connect();
    await this.collection.insertOne(myClass);
  }

  /**
   * Update an existing class in the database. Ensure that the _id field of the
   * entity matches the one you are trying to update.
   *
   * @param myClass - The class entity to update.
   */
  public async update(myClass: Class): Promise<void> {
    await mongoClient.connect();
    await this.collection.updateOne(
      { _id: myClass._id },
      {
        $set: { ...myClass, date_updated: new Date() },
      },
    );
  }
}
