import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export default class User {
  /**
   * Unique GUID of this user.
   */
  public readonly _id: string;

  /**
   * The name of this user.
   */
  public name: string;

  /**
   * The email address of this user.
   */
  public email: string;

  /**
   * The hashed password of this user.
   */
  public password: string;

  /**
   * The date in which this user was created.
   */
  public readonly dateCreated: Date;

  /**
   * The date in which this user was last updated.
   */
  public readonly dateUpdated: Date;

  /**
   * @param name - The name of this user.
   *
   * @param email - The email address of this user.
   *
   * @param password - Plaintext password of this user (will be hashed).
   */
  constructor(name: string, email: string, password: string) {
    const objectId = new ObjectId();
    const passwordHash = bcrypt.hashSync(password, 8);

    this._id = objectId.toHexString();
    this.name = name;
    this.email = email;
    this.password = passwordHash;
    this.dateCreated = new Date();
    this.dateUpdated = new Date();
  }
}
