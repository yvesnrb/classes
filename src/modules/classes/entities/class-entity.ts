import { ObjectId } from 'mongodb';

interface ICreateClass {
  name: string;
  description: string;
  video: string;
  dateInit: Date;
  dateEnd: Date;
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
  public dateInit: Date;

  /**
   * The date in which this class will become unavailable.
   */
  public dateEnd: Date;

  /**
   * The date in which this class was created.
   */
  public readonly dateCreated: Date;

  /**
   * The date in which this class was last updated.
   */
  public readonly dateUpdated: Date;

  /**
   * @param data - An instance of ICreateClass.
   */
  constructor(data: ICreateClass) {
    const {
      name,
      description,
      video,
      dateInit,
      dateEnd,
    } = data;
    const objectId = new ObjectId();

    this._id = objectId.toHexString();
    this.name = name;
    this.description = description;
    this.video = video;
    this.dateInit = dateInit;
    this.dateEnd = dateEnd;
    this.dateCreated = new Date();
    this.dateUpdated = new Date();
  }
}
