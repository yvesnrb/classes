import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import MockDate from 'mockdate';

import User from '@entities/user-entity';

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

jest.mock('bcryptjs', () => {
  return {
    hashSync: jest.fn().mockImplementation(() => 'mock hash'),
  };
});

describe('UserEntity', () => {
  it('should create a new user entity', () => {
    const user = new User('John Doe', 'j.doe@mail.com', 'pass');

    expect(ObjectId).toHaveBeenCalled();
    expect(toHexString).toHaveBeenCalled();

    expect(bcrypt.hashSync).toHaveBeenCalledWith('pass', 8);

    expect(user).toEqual({
      _id: 'mock guid',
      name: 'John Doe',
      email: 'j.doe@mail.com',
      password: 'mock hash',
      date_created: new Date('01/01/2021 14:00:00.00Z'),
      date_updated: new Date('01/01/2021 14:00:00.00Z'),
    });
  });
});
