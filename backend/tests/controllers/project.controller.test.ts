import { createProject, getProjectsByTeam } from '../../src/controllers/project.controller';
import { ProjectService } from '../../src/services/project.service';
import { ApiResponse } from '../../src/utils/ApiResponse';
import { Types } from 'mongoose';

jest.mock('../../src/services/project.service');

describe('ProjectController', () => {
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, user: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should return 404 if user not found', async () => {
      mockReq.user = null;
      mockReq.body = { name: 'Project A', description: 'desc', teamId: 'team1' };

      await createProject(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User does not exist',
      });
    });

    it('should create project successfully', async () => {
      const fakeProject = { _id: '1', name: 'Project A', teamId: 'team1' };
      mockReq.user = { _id: new Types.ObjectId() };
      mockReq.body = { name: 'Project A', description: 'desc', teamId: 'team1' };
      (ProjectService.createProject as jest.Mock).mockResolvedValue(fakeProject);

      await createProject(mockReq, mockRes, jest.fn());

      expect(ProjectService.createProject).toHaveBeenCalledWith(
        'Project A',
        'team1',
        mockReq.user._id,
        'desc'
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        new ApiResponse(201, fakeProject, 'Project created successfully')
      );
    });
  });

  describe('getProjectsByTeam', () => {
    it('should return 400 if teamId is not provided', async () => {
      mockReq.params = {};

      await getProjectsByTeam(mockReq, mockRes, jest.fn());

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'TeamId is required',
      });
    });

    it('should fetch projects successfully', async () => {
      const fakeProjects = [{ _id: '1', name: 'Project A' }];
      mockReq.params = { teamId: 'team1' };
      (ProjectService.getProjectsByTeam as jest.Mock).mockResolvedValue(fakeProjects);

      await getProjectsByTeam(mockReq, mockRes, jest.fn());

      expect(ProjectService.getProjectsByTeam).toHaveBeenCalledWith('team1');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        new ApiResponse(200, fakeProjects, 'Projects fetched successfully')
      );
    });
  });
});
