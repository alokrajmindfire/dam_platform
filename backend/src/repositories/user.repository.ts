import { User } from '../models/user.model';

export class UserRepository {
  static async findById(userId: number) {
    return User.findById(userId);
  }

  static async findByEmail(email: string) {
    return User.findOne({ email });
  }

  static async createUser(data: {
    fullName: string;
    email: string;
    password: string;
  }) {
    return User.create(data);
  }

  static async save(user: any) {
    return user.save({ validateBeforeSave: false });
  }

  static async selectWithoutPassword(userId: string) {
    return User.findById(userId).select('-password');
  }
}
