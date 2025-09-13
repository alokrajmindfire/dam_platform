import { ApiError } from 'src/utils/ApiError';
import { Team, ITeam } from '../models/team.model';
import { Types, Schema } from 'mongoose';

export class TeamRepository {
  static async createTeam(data: {
    name: string;
    description?: string;
    ownerId: Schema.Types.ObjectId;
    role?: string;
  }): Promise<ITeam> {
    const existingTeam = await Team.findOne({ 'members.userId': data.ownerId });

    if (existingTeam) {
      throw new ApiError(400, 'User is already a member of a team');
    }

    return Team.create({
      name: data.name,
      description: data.description,
      members: [{ userId: data.ownerId, role: data.role || 'owner' }],
      createdBy: data.ownerId,
    });
  }

  static async addMember(
    teamId: string,
    userId: Schema.Types.ObjectId,
    role: string,
  ): Promise<ITeam | null> {
    const teamObjectId = new Types.ObjectId(teamId);
    const memberObjectId =
      typeof userId === 'string' ? new Types.ObjectId(userId) : userId;

    return Team.findByIdAndUpdate(
      teamObjectId,
      { $addToSet: { members: { userId: memberObjectId, role } } },
      { new: true },
    ).populate('members.userId', 'name email');
  }

  static async findById(teamId: string): Promise<ITeam | null> {
    return Team.findById(new Types.ObjectId(teamId)).populate(
      'members.userId',
      'name email',
    );
  }

  static async getAllTeams(userId: string): Promise<ITeam[]> {
    const objectId = new Types.ObjectId(userId);

    return Team.find({
      $or: [{ createdBy: objectId }, { 'members.userId': objectId }],
    }).populate('members.userId', 'name email');
  }

  static async getTeamMembers(teamId: string): Promise<ITeam | null> {
    return Team.findById(new Types.ObjectId(teamId)).populate(
      'members.userId',
      'fullName email',
    );
  }

  static async getTeamAssets(teamId: string) {
    return Team.aggregate([
      { $match: { _id: new Types.ObjectId(teamId) } },
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
}
