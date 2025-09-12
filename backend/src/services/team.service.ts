import { TeamRepository } from '../repositories/team.repository';
import { ApiError } from '../utils/ApiError';
import { AssetRepository } from '../repositories/assets.repositories';
import { Schema } from 'mongoose';

export class TeamService {
  static async createTeam(
    name: string,
    description: string | undefined,
    ownerId: Schema.Types.ObjectId,
    role: string,
  ) {
    const team = await TeamRepository.createTeam({
      name,
      description,
      ownerId,
      role,
    });
    return team;
  }

  static async addMember(
    teamId: string,
    userId: Schema.Types.ObjectId,
    role: string,
  ) {
    const team = await TeamRepository.findById(teamId);
    if (!team) throw new ApiError(404, 'Team not found');

    const updated = await TeamRepository.addMember(teamId, userId, role);
    return updated;
  }

  static async getTeamAssets(teamId: string, userId: Schema.Types.ObjectId) {
    const team = await TeamRepository.findById(teamId);
    if (!team) throw new ApiError(404, 'Team not found');

    const isMember = team.members.some(
      (m) => m.userId.toString() === userId.toString(),
    );
    if (!isMember) throw new ApiError(403, 'Not authorized for this team');

    const { data, total } = await AssetRepository.findManyForUser(userId, {
      teamId,
    });
    return { data, total };
  }
  static async getAllTeams(userId: string) {
    const teams = await TeamRepository.getAllTeams(userId);
    return teams;
  }
  static async getTeamMembers(teamId: string) {
    const team = await TeamRepository.getTeamMembers(teamId);
    return team;
  }
}
