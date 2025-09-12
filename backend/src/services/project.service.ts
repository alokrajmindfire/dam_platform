import { Project, IProject } from '../models/project.model';
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
    // reuse repository query
    // filter by projectId + team membership
    // similar to TeamService.getTeamAssets
  }
}
