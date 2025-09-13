import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { TeamService } from '../services/team.service';
import { Schema } from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../models/user.model';

const createTeam = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const { name, description } = req.body;
    const user = req.user;
    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }
    const ownerId = user._id as Schema.Types.ObjectId;
    const role = user.role;

    const team = await TeamService.createTeam(name, description, ownerId, role);

    return res
      .status(201)
      .json(new ApiResponse(201, team, 'Team created successfully'));
  },
);

const addMember = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const { userId, role } = req.body;
    const { teamId } = req.params;
    const user = req.user;
    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }

    const updatedTeam = await TeamService.addMember(teamId, userId, role);

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTeam, 'Member added successfully'));
  },
);
const getAllTeams = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const userId = req.user?._id as string;
    if (!userId) {
      throw new ApiError(404, 'User does not exist');
    }
    const teams = await TeamService.getAllTeams(userId);
    return res
      .status(200)
      .json(new ApiResponse(200, teams, 'Teams fetched successfully'));
  },
);
const getTeamMembers = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const { teamId } = req.params;
    const team = await TeamService.getTeamMembers(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    return res
      .status(200)
      .json(new ApiResponse(200, team.members, 'Member fetched successfully'));
  },
);
export { createTeam, addMember, getAllTeams, getTeamMembers };
