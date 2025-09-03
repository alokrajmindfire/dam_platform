import { UserRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/ApiError';

export class UserService {
  static async generateAccessToken(userId: number) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }
    const accessToken = user.generateAccessToken();
    await UserRepository.save(user);
    return accessToken;
  }

  static async registerUser(fullName: string, email: string, password: string) {
    const existedUser = await UserRepository.findByEmail(email);
    if (existedUser) {
      throw new ApiError(409, 'User with email already exists');
    }

    const user = await UserRepository.createUser({ fullName, email, password });
    const createdUser = await UserRepository.selectWithoutPassword(
      user._id?.toString() || '',
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        'Something went wrong while registering the user',
      );
    }

    return createdUser;
  }

  static async loginUser(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid user credentials');
    }

    const accessToken = await this.generateAccessToken(user._id as number);
    const loggedInUser = await UserRepository.selectWithoutPassword(
      user._id?.toString() || '',
    );

    return { loggedInUser, accessToken };
  }
}
