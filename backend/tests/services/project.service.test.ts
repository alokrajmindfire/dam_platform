import { ProjectService } from '../../src/services/project.service';
import { Project } from '../../src/models/project.model';
import { TeamRepository } from '../../src/repositories/team.repository';
import { AssetRepository } from '../../src/repositories/assets.repositories';
import { Schema, Types } from 'mongoose';
import { ApiError } from '../../src/utils/ApiError';

jest.mock('../../src/models/project.model');
jest.mock('../../src/repositories/team.repository');
jest.mock('../../src/repositories/assets.repositories');

describe('ProjectService', () => {
    const mockProjectId = new Types.ObjectId();
    const mockTeamId = new Types.ObjectId();
    const mockUserId = new Types.ObjectId();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createProject', () => {
        it('should create a project and return it', async () => {
            const fakeProject = { _id: mockProjectId, name: 'Test Project', save: jest.fn().mockResolvedValue({ _id: mockProjectId, name: 'Test Project' }) };
            (Project as any).mockImplementation(() => fakeProject);

            const result = await ProjectService.createProject('Test Project', mockTeamId as unknown as Schema.Types.ObjectId, mockUserId as unknown as Schema.Types.ObjectId, 'desc');

            expect(fakeProject.save).toHaveBeenCalled();
            expect(result).toEqual({ _id: mockProjectId, name: 'Test Project' });
        });
    });

    describe('getProjectsByTeam', () => {
        it('should return projects for a given team', async () => {
            const mockProjects = [{ _id: mockProjectId, name: 'Project 1' }];
            (Project.find as jest.Mock).mockReturnValue({
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockProjects),
            });

            const result = await ProjectService.getProjectsByTeam(String(mockTeamId));

            expect(Project.find).toHaveBeenCalledWith({ teamId: String(mockTeamId) });
            expect(result).toEqual(mockProjects);
        });
    });

    describe('getProjectAssets', () => {
        it('should throw error if project not found', async () => {
            (Project.findById as jest.Mock).mockResolvedValue(null);

            await expect(ProjectService.getProjectAssets(String(mockProjectId), mockUserId as unknown as Schema.Types.ObjectId)).rejects.toThrow(ApiError);
        });

        it('should throw error if team not found', async () => {
            (Project.findById as jest.Mock).mockResolvedValue({ _id: mockProjectId, teamId: mockTeamId });
            (TeamRepository.findById as jest.Mock).mockResolvedValue(null);

            await expect(ProjectService.getProjectAssets(String(mockProjectId), mockUserId as unknown as Schema.Types.ObjectId)).rejects.toThrow(ApiError);
        });

        it('should throw error if user is not a team member', async () => {
            (Project.findById as jest.Mock).mockResolvedValue({ _id: mockProjectId, teamId: mockTeamId });
            (TeamRepository.findById as jest.Mock).mockResolvedValue({ _id: mockTeamId, members: [{ userId: new Types.ObjectId() }] });

            await expect(ProjectService.getProjectAssets(String(mockProjectId), mockUserId as unknown as Schema.Types.ObjectId)).rejects.toThrow(ApiError);
        });

        it('should return assets if user is a team member', async () => {
            const mockAssets = { data: [{ _id: 'asset1' }], total: 1 };
            (Project.findById as jest.Mock).mockResolvedValue({ _id: mockProjectId, teamId: mockTeamId });
            (TeamRepository.findById as jest.Mock).mockResolvedValue({ _id: mockTeamId, members: [{ userId: mockUserId }] });
            (AssetRepository.findManyForUser as jest.Mock).mockResolvedValue(mockAssets);

            const result = await ProjectService.getProjectAssets(String(mockProjectId), mockUserId as unknown as Schema.Types.ObjectId);

            expect(AssetRepository.findManyForUser).toHaveBeenCalledWith(mockUserId, {
                teamId: String(mockTeamId),
                projectId: String(mockProjectId),
            });
            expect(result).toEqual(mockAssets);
        });
    });
});
