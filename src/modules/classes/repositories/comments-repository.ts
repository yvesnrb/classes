import { Collection, Filter } from 'mongodb';

import Comment from '@entities/comment-entity';
import mongoConfig from '@config/mongodb';
import mongoClient from '@/db';

export default class CommentsRepository {
  private collection: Collection<Comment>;

  constructor() {
    this.collection = mongoClient
      .db(mongoConfig.database)
      .collection<Comment>('comments');
  }

  /**
   * Count the doucments that match a filter.
   *
   * @param filters - MongoDB filters for the Comment entity.
   *
   * @returns The number of documents matching that filter
   */
  public async count(filters: Filter<Comment>): Promise<number> {
    await mongoClient.connect();
    const count = await this.collection.count(filters);

    return count;
  }

  /**
   * Find one comment in the database.
   *
   * @param filters - MongoDB filters for the Comment entity.
   *
   * @returns The comment if found, null otherwise.
   */
  public async find(filters: Filter<Comment>): Promise<Comment | null> {
    await mongoClient.connect();
    const comment = await this.collection.findOne(filters);

    return comment;
  }

  /**
   * Lists many comments from the database.
   *
   * @param filters - MongoDB filters for the Comment entity.
   *
   * @param skip - Skip this many documents in the list.
   *
   * @param limit - Limit the list size to this many documents.
   *
   * @returns An array of comments.
   */
  public async list(
    filters: Filter<Comment>,
    skip: number,
    limit: number,
  ): Promise<Comment[]> {
    await mongoClient.connect();
    const list = this.collection
      .find(filters)
      .limit(limit)
      .skip(skip)
      .sort({ date_created: -1 })
      .toArray();

    return list;
  }

  /**
   * Save a new comment entity to the database.
   *
   * @param comment - The comment entity to save.
   */
  public async save(comment: Comment): Promise<void> {
    await mongoClient.connect();
    await this.collection.insertOne(comment);
  }

  /**
   * Update an existing comment in the database. Ensure that the _id field of
   * the entity matches the one you are trying to update.
   *
   * @param comment - The comment entity to update.
   */
  public async update(comment: Comment): Promise<void> {
    await mongoClient.connect();
    await this.collection.updateOne(
      { _id: comment._id },
      {
        $set: { ...comment, date_updated: new Date() },
      },
    );
  }
}
