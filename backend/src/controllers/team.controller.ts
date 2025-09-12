import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { TeamService } from '../services/team.service';
import { Schema, Types } from 'mongoose';
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
    //   const ownerId = user._id as Schema.Types.ObjectId;
    const updatedTeam = await TeamService.addMember(teamId, userId, role);

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTeam, 'Member added successfully'));
  },
);

const getTeamAssets = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const { teamId } = req.params;
    const user = req.user;
    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }
    const userId = user._id as Schema.Types.ObjectId;

    const assets = await TeamService.getTeamAssets(teamId, userId);

    return res
      .status(200)
      .json(new ApiResponse(200, assets, 'Team assets fetched successfully'));
  },
);
const getAllTeams = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new ApiError(404, 'User does not exist');
    }
    const teams = await TeamService.getAllTeams();
    return res
      .status(200)
      .json(new ApiResponse(200, teams, 'Team assets fetched successfully'));
  },
);

export { createTeam, addMember, getTeamAssets, getAllTeams };
