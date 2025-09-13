import { Project, IProject } from '../models/project.model';
import { TeamRepository } from '../repositories/team.repository';
import { AssetRepository } from '../repositories/assets.repositories';
import { Schema } from 'mongoose';
import { ApiError } from '../utils/ApiError';

export class ProjectService {
  static async createProject(
    name: string,
    teamId: Schema.Types.ObjectId,
    createdBy: Schema.Types.ObjectId,
    description?: string,
  ): Promise<IProject> {
    const project = new Project({ name, teamId, createdBy, description });
    return project.save();
  }

  static async getProjectsByTeam(teamId: string) {
    return Project.find({ teamId }).lean().exec();
  }

  static async getProjectAssets(
    projectId: string,
    userId: Schema.Types.ObjectId,
  ) {
    const project = await Project.findById(projectId);
    if (!project) throw new ApiError(404, 'Project not found');

    const team = await TeamRepository.findById(String(project.teamId));
    if (!team) throw new ApiError(404, 'Team not found');

    const isMember = team.members.some(
      (m) => m.userId.toString() === userId.toString(),
    );
    if (!isMember) throw new ApiError(403, 'Not authorized for this project');

    const { data, total } = await AssetRepository.findManyForUser(userId, {
      teamId: String(project.teamId),
      projectId: String(project._id),
    });

    return { data, total };
  }
}
