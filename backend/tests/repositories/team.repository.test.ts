import { TeamRepository } from '../../src/repositories/team.repository';
import { Team } from '../../src/models/team.model';
import { ApiError } from '../../src/utils/ApiError';
import { Schema, Types } from 'mongoose';

jest.mock('../../src/models/team.model');

describe('TeamRepository', () => {
  const mockUserId = new Types.ObjectId();
  const mockTeamId = new Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTeam', () => {
    it('should throw error if user is already a member of a team', async () => {
      // mock findOne to return a team
      (Team.findOne as jest.Mock).mockResolvedValue({ _id: mockTeamId });

      await expect(
        TeamRepository.createTeam({
          name: 'Team 1',
          ownerId: mockUserId as unknown as Schema.Types.ObjectId,
        }),
      ).rejects.toThrow(ApiError);

      expect(Team.findOne).toHaveBeenCalledWith({ 'members.userId': mockUserId });
    });

    it('should create a team successfully', async () => {
      const mockTeam = { _id: mockTeamId, name: 'Team 1', members: [] };
      (Team.findOne as jest.Mock).mockResolvedValue(null);
      (Team.create as jest.Mock).mockResolvedValue(mockTeam);

      const result = await TeamRepository.createTeam({
        name: 'Team 1',
        ownerId: mockUserId as unknown as Schema.Types.ObjectId,
      });

      expect(Team.findOne).toHaveBeenCalledWith({ 'members.userId': mockUserId });
      expect(Team.create).toHaveBeenCalledWith({
        name: 'Team 1',
        members: [{ userId: mockUserId, role: 'owner' }],
        createdBy: mockUserId,
      });
      expect(result).toEqual(mockTeam);
    });
  });

  describe('addMember', () => {
    it('should add a member and return updated team', async () => {
      const updatedTeam = { _id: mockTeamId, members: [{ userId: mockUserId, role: 'member' }] };

      (Team.findByIdAndUpdate as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(updatedTeam),
      });

      const result = await TeamRepository.addMember(
        mockTeamId.toHexString(),
        mockUserId as unknown as Schema.Types.ObjectId,
        'member',
      );

      expect(Team.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTeamId,
        { $addToSet: { members: { userId: mockUserId, role: 'member' } } },
        { new: true },
      );
      expect(result).toEqual(updatedTeam);
    });
  });

  describe('findById', () => {
    it('should return a team', async () => {
      const mockTeam = { _id: mockTeamId, members: [] };
      (Team.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTeam),
      });

      const result = await TeamRepository.findById(mockTeamId.toHexString());
      expect(Team.findById).toHaveBeenCalledWith(mockTeamId);
      expect(result).toEqual(mockTeam);
    });
  });

  describe('getAllTeams', () => {
    it('should return teams for user', async () => {
      const mockTeams = [{ _id: mockTeamId }];
      (Team.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTeams),
      });

      const result = await TeamRepository.getAllTeams(mockUserId.toHexString());
      expect(Team.find).toHaveBeenCalledWith({
        $or: [{ createdBy: mockUserId }, { 'members.userId': mockUserId }],
      });
      expect(result).toEqual(mockTeams);
    });
  });

  describe('getTeamMembers', () => {
    it('should return team with members', async () => {
      const mockTeam = { _id: mockTeamId, members: [{ userId: mockUserId }] };
      (Team.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTeam),
      });

      const result = await TeamRepository.getTeamMembers(mockTeamId.toHexString());
      expect(Team.findById).toHaveBeenCalledWith(mockTeamId);
      expect(result).toEqual(mockTeam);
    });
  });

  describe('getTeamAssets', () => {
    it('should call aggregate and return assets', async () => {
      const mockAssets = [{ _id: new Types.ObjectId() }];
      (Team.aggregate as jest.Mock).mockResolvedValue(mockAssets);

      const result = await TeamRepository.getTeamAssets(mockTeamId.toHexString());
      expect(Team.aggregate).toHaveBeenCalledWith([
        { $match: { _id: mockTeamId } },
        {
          $lookup: {
            from: 'assets',
            localField: '_id',
            foreignField: 'teamId',
            as: 'assets',
          },
        },
      ]);
      expect(result).toEqual(mockAssets);
    });
  });
});
