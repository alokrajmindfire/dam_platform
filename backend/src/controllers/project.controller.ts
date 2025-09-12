import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ProjectService } from '../services/project.service';
import { ApiError } from '../utils/ApiError';
import { IUser } from '../models/user.model';
import { Schema } from 'mongoose';

const createProject = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const { name, description, teamId } = req.body;
    const user = req.user;
    if (!user) throw new ApiError(404, 'User does not exist');

    const project = await ProjectService.createProject(
      name,
      teamId,
      user._id as Schema.Types.ObjectId,
      description,
    );

    return res
      .status(201)
      .json(new ApiResponse(201, project, 'Project created successfully'));
  },
);

const getProjectsByTeam = asyncHandler(
  async (req: Request & { user?: IUser }, res: Response) => {
    const { teamId } = req.params;
    if (!teamId) throw new ApiError(400, 'TeamId is required');

    const projects = await ProjectService.getProjectsByTeam(teamId);
    return res
      .status(200)
      .json(new ApiResponse(200, projects, 'Projects fetched successfully'));
  },
);

export const ProjectController = {
  createProject,
  getProjectsByTeam,
};
