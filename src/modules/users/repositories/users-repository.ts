import { Collection, Filter } from 'mongodb';

import User from '@entities/user-entity';
import mongoConfig from '@config/mongodb';
import mongoClient from '@/db';

export default class UsersRepository {
  public collection: Collection<User>;

  constructor() {
    this.collection = mongoClient
      .db(mongoConfig.database)
      .collection<User>('users');
  }

  /**
   * Find one user in the database.
   *
   * @param filters - MongoDB filters for the User entity.
   *
   * @returns The user if found, null otherwise.
   */
  public async find(filters: Filter<User>): Promise<User | null> {
    await mongoClient.connect();
    const user = await this.collection.findOne(filters);

    return user;
  }

  /**
   * Lists many users from the database.
   *
   * @param filters - MongoDB filters for the User entity.
   *
   * @param skip - Skip this many documents in the list.
   *
   * @param limit - Limit the list size to this many documents.
   *
   * @returns An array of users.
   */
  public async list(
    filters: Filter<User>,
    skip: number,
    limit: number,
  ): Promise<User[]> {
    await mongoClient.connect();
    const list = this.collection
      .find(filters)
      .limit(limit)
      .skip(skip)
      .toArray();

    return list;
  }

  /**
   * Save a new user entity to the database.
   *
   * @param user - The user entity to save.
   */
  public async save(user: User): Promise<void> {
    await mongoClient.connect();
    await this.collection.insertOne(user);
  }

  /**
   * Update an existing user in the database. Ensure that the _id field of the
   * entity matches the one you are trying to update.
   *
   * @param user - The user entity to update.
   */
  public async update(user: User): Promise<void> {
    await mongoClient.connect();
    await this.collection.updateOne(
      { _id: user._id },
      {
        $set: { ...user, date_updated: new Date() },
      },
    );
  }
}
