import { Team, ITeam } from '../models/team.model';
import { Schema, Types } from 'mongoose';

export class TeamRepository {
  static async createTeam(data: {
    name: string;
    description?: string;
    ownerId: Schema.Types.ObjectId;
    role: string;
  }): Promise<ITeam> {
    return Team.create({
      name: data.name,
      description: data.description,
      members: [{ userId: data.ownerId, role: data.role }],
      createdBy: data.ownerId,
    });
  }

  static async addMember(
    teamId: string,
    userId: Schema.Types.ObjectId,
    role: 'admin' | 'member' = 'member',
  ): Promise<ITeam | null> {
    return Team.findByIdAndUpdate(
      teamId,
      { $addToSet: { members: { userId, role } } },
      { new: true },
    );
  }

  static async findById(teamId: string): Promise<ITeam | null> {
    return Team.findById(teamId).populate('members.userId', '-password');
  }

  static async getTeamAssets(teamId: string) {
    return Team.aggregate([
      { $match: { _id: new Schema.Types.ObjectId(teamId) } },
      {
        $lookup: {
          from: 'assets',
          localField: '_id',
          foreignField: 'teamId',
          as: 'assets',
        },
      },
    ]);
  }
  static async getAllTeams() {
    const teams = await Team.find().populate('members');
    return teams;
  }
}
