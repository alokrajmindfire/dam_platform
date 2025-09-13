import { TeamRepository } from '../repositories/team.repository';
import { ApiError } from '../utils/ApiError';
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
  static async getAllTeams(userId: string) {
    const teams = await TeamRepository.getAllTeams(userId);
    return teams;
  }
  static async getTeamMembers(teamId: string) {
    const team = await TeamRepository.getTeamMembers(teamId);
    return team;
  }
}
