import { ObjectId } from 'mongodb';

export default class Comment {
  /**
   * Unique GUID of this comment.
   */
  public readonly _id: string;

  /**
   * GUID of the class this comment refers to.
   */
  public readonly classId: string;

  /**
   * The body of this comment.
   */
  public comment: string;

  /**
   * The date in which this comment was created.
   */
  public readonly dateCreated: Date;

  /**
   * @param classId - GUID of the class this comment refers to.
   *
   * @param comment - The body of this comment.
   */
  constructor(classId: string, comment: string) {
    const objectId = new ObjectId();

    this._id = objectId.toHexString();
    this.classId = classId;
    this.comment = comment;
    this.dateCreated = new Date();
  }
}
