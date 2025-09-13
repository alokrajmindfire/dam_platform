import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { UserService } from '../services/user.service';
import {
  registerUserSchema,
  loginUserSchema,
  updateVisibilitySchema,
} from '../validations/user.validation';
import { IUser } from 'src/models/user.model';

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

const logoutUser = asyncHandler(async (_: Request, res: Response) => {
  const options = { httpOnly: true, secure: true };
  return res
    .status(200)
    .clearCookie('accessToken', options)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

const getPublicUsers = asyncHandler(async (_: Request, res: Response) => {
  const user = await UserService.getPublicUsers();
  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User profile updated successfully'));
});
const updateProfileVisibility = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const id: string = req.user?._id as string;
    const parseResult = updateVisibilitySchema.safeParse({
      body: req.body,
    });

    if (!parseResult.success) {
      const errorMessage = parseResult.error.message;
      return res.status(400).json(new ApiResponse(400, null, errorMessage));
    }

    const { profileVisibility } = req.body;
    const user = await UserService.updateProfileVisibility(
      id,
      profileVisibility,
    );
    return res
      .status(200)
      .json(new ApiResponse(200, user, 'User profile updated successfully'));
  },
);

export {
  registerUser,
  loginUser,
  logoutUser,
  getPublicUsers,
  updateProfileVisibility,
};
