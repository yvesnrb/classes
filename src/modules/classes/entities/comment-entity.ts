import { ObjectId } from 'mongodb';

export default class Comment {
  /**
   * Unique GUID of this comment.
   */
  public readonly _id: string;

  /**
   * GUID of the class this comment refers to.
   */
  public readonly id_class: string;

  /**
   * The body of this comment.
   */
  public comment: string;

  /**
   * The date in which this comment was created.
   */
  public readonly date_created: Date;

  /**
   * @param id_class - GUID of the class this comment refers to.
   *
   * @param comment - The body of this comment.
   */
  constructor(id_class: string, comment: string) {
    const objectId = new ObjectId();

    this._id = objectId.toHexString();
    this.id_class = id_class;
    this.comment = comment;
    this.date_created = new Date();
  }
}
