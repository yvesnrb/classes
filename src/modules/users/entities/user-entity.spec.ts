import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import MockDate from 'mockdate';

import User from '@entities/user-entity';

describe('UserEntity', () => {
  it('should create a new user entity', () => {
    MockDate.set(new Date('01/01/2021 14:00:00.00Z'));

    const objectIdToHexStringSpy = jest
      .spyOn(ObjectId.prototype, 'toHexString')
      .mockReturnValue('mock-user-id');

    const bcryptHashSyncSpy = jest
      .spyOn(bcrypt, 'hashSync')
      .mockReturnValue('mock-hash');

    const user = new User('John Doe', 'j.doe@mail.com', 'pass');

    expect(objectIdToHexStringSpy).toHaveBeenCalled();

    expect(bcryptHashSyncSpy).toHaveBeenCalledWith('pass', 8);

    expect(user).toEqual({
      _id: 'mock-user-id',
      name: 'John Doe',
      email: 'j.doe@mail.com',
      password: 'mock-hash',
      dateCreated: new Date('01/01/2021 14:00:00.00Z'),
      dateUpdated: new Date('01/01/2021 14:00:00.00Z'),
    });
  });
});
