import userModel, { IUser } from './model';
import { cleanFilterQuery } from '../../utils/cleanFilterQuery';

class userServices {
  async createUser(payload: Partial<IUser>): Promise<IUser> {
    const existingUser = await userModel.findOne({ email: payload.email! });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = await userModel.create(payload);
    return newUser;
  }

  async updateUser(
    searchData: Partial<IUser>,
    updates: Partial<IUser>,
  ): Promise<IUser> {
    const filter = cleanFilterQuery({ ...searchData });
    const updatedUser = await userModel
      .findOneAndUpdate(filter, updates, { new: true })
      .exec();

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  }

  async findUsers(
    searchData: Partial<IUser>,
    pagination: number = 0,
    limit: number = 20,
  ): Promise<IUser[]> {
    const filter = cleanFilterQuery({ ...searchData });
    const Users = await userModel
      .find(filter)
      .limit(limit)
      .skip(pagination)
      .exec();
    return Users;
  }

  async findOneUser(searchData: Partial<IUser>): Promise<IUser> {
    const filter = cleanFilterQuery({ ...searchData });
    const User = await userModel.findOne(filter).exec();

    if (!User) {
      throw new Error('User not found');
    }

    return User;
  }

  async deleteUser(searchData: Partial<IUser>): Promise<IUser | null> {
    const filter = cleanFilterQuery({ ...searchData });
    const deletedUser = await userModel.findOneAndDelete(filter).exec();
    return deletedUser;
  }
}

export default new userServices();
