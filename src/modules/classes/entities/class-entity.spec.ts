import { ObjectId } from 'mongodb';
import MockDate from 'mockdate';

import Class from '@entities/class-entity';

describe('ClassEntity', () => {
  it('should create a new class entity', () => {
    MockDate.set(new Date('01/01/2021 14:00:00.00Z'));

    const objectIdToHexStringSpy = jest
      .spyOn(ObjectId.prototype, 'toHexString')
      .mockReturnValue('mock-class-id');

    const myClass = new Class({
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      dateInit: new Date('01/01/2021 14:00:00'),
      dateEnd: new Date('01/02/2021 14:00:00'),
    });

    expect(objectIdToHexStringSpy).toHaveBeenCalled();

    expect(myClass).toEqual({
      _id: 'mock-class-id',
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      dateInit: new Date('01/01/2021 14:00:00'),
      dateEnd: new Date('01/02/2021 14:00:00'),
      dateCreated: new Date('01/01/2021 14:00:00.00Z'),
      dateUpdated: new Date('01/01/2021 14:00:00.00Z'),
    });
  });
});
