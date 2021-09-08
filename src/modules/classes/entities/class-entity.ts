import { ObjectId } from 'mongodb';

interface ICreateClass {
  name: string;
  description: string;
  video: string;
  data_init: Date;
  data_end: Date;
}

export default class Class {
  /**
   * Unique GUID of this class.
   */
  public readonly _id: string;

  /**
   * The name of this class.
   */
  public name: string;

  /**
   * The description of this class.
   */
  public description: string;

  /**
   * The video URL of this class.
   */
  public video: string;

  /**
   * The date in which this class will become available.
   */
  public data_init: Date;

  /**
   * The date in which this class will become unavailable.
   */
  public data_end: Date;

  /**
   * The date in which this class was created.
   */
  public readonly date_created: Date;

  /**
   * The date in which this class was last updated.
   */
  public readonly date_updated: Date;

  /**
   * @param data - An instance of ICreateClass.
   */
  constructor(data: ICreateClass) {
    const {
      name,
      description,
      video,
      data_init,
      data_end,
    } = data;
    const objectId = new ObjectId();

    this._id = objectId.toHexString();
    this.name = name;
    this.description = description;
    this.video = video;
    this.data_init = data_init;
    this.data_end = data_end;
    this.date_created = new Date();
    this.date_updated = new Date();
  }
}
