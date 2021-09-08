import { ObjectId } from 'mongodb';
import MockDate from 'mockdate';

import Class from '@entities/class-entity';

MockDate.set(new Date('01/01/2021 14:00:00.00Z'));

const toHexString = jest.fn().mockImplementation(() => 'mock guid');

jest.mock('mongodb', () => {
  return {
    ObjectId: jest.fn().mockImplementation(() => {
      return {
        toHexString,
      };
    }),
  };
});

describe('ClassEntity', () => {
  it('should create a new class entity', () => {
    const myClass = new Class({
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
    });

    expect(ObjectId).toHaveBeenCalled();

    expect(myClass).toEqual({
      _id: 'mock guid',
      name: 'Class 1',
      description: 'lorem ipsum dolorem sit amet',
      video: 'http://google.com',
      data_init: new Date('01/01/2021 14:00:00'),
      data_end: new Date('01/02/2021 14:00:00'),
      date_created: new Date('01/01/2021 14:00:00.00Z'),
      date_updated: new Date('01/01/2021 14:00:00.00Z'),
    });
  });
});
