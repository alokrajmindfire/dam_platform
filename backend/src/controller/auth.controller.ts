import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { UserService } from '../services/user.service';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/user.validation';

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = registerUserSchema.parse(req.body);
  const createdUser = await UserService.registerUser(
    parsedData.fullName,
    parsedData.email,
    parsedData.password,
  );
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = loginUserSchema.parse(req.body);

  const { loggedInUser, accessToken } = await UserService.loginUser(
    parsedData.email,
    parsedData.password,
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none' as const,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        'User logged in successfully',
      ),
    );
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .clearCookie('accessToken', options)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

export { registerUser, loginUser, logoutUser };
