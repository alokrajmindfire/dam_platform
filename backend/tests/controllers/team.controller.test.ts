import {
    createTeam,
    addMember,
    getAllTeams,
    getTeamMembers,
} from "../../src/controllers/team.controller";
import { TeamService } from "../../src/services/team.service";
import { ApiResponse } from "../../src/utils/ApiResponse";
import mongoose from "mongoose";

jest.mock("../../src/services/team.service");

describe("TeamController", () => {
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

    describe("createTeam", () => {
        it("should throw error if user not found", async () => {
            mockReq.user = null;

            await createTeam(mockReq, mockRes, jest.fn());

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: "User does not exist",
            });
        });

        it("should create a team and return response", async () => {
            const fakeTeam = { _id: "1", name: "Test Team" };
            mockReq.user = { _id: new mongoose.Types.ObjectId(), role: "admin" };
            mockReq.body = { name: "Test Team", description: "desc" };
            (TeamService.createTeam as jest.Mock).mockResolvedValue(fakeTeam);
            const next = jest.fn();

            await createTeam(mockReq, mockRes, next);

            expect(TeamService.createTeam).toHaveBeenCalledWith(
                "Test Team",
                "desc",
                mockReq.user._id,
                "admin"
            );
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(
                new ApiResponse(201, fakeTeam, "Team created successfully")
            );
        });
    });

    describe("addMember", () => {
        it("should throw error if user not found", async () => {
            mockReq.user = null;

            await addMember(mockReq, mockRes, jest.fn());

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: "User does not exist",
            });
        });

        it("should add member and return response", async () => {
            const fakeTeam = { _id: "1", members: [{ _id: "2", role: "member" }] };
            mockReq.user = { _id: "1" };
            mockReq.body = { userId: "2", role: "member" };
            mockReq.params = { teamId: "1" };
            (TeamService.addMember as jest.Mock).mockResolvedValue(fakeTeam);
            const next = jest.fn();

            await addMember(mockReq, mockRes, next);

            expect(TeamService.addMember).toHaveBeenCalledWith("1", "2", "member");
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                new ApiResponse(200, fakeTeam, "Member added successfully")
            );
        });
    });

    describe("getAllTeams", () => {
        it("should throw error if user not found", async () => {
            mockReq.user = null;
            await getAllTeams(mockReq, mockRes, jest.fn());

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message: "User does not exist",
            });
        });

        it("should fetch all teams for user", async () => {
            const fakeTeams = [{ _id: "1", name: "Team 1" }];
            mockReq.user = { _id: "1" };
            (TeamService.getAllTeams as jest.Mock).mockResolvedValue(fakeTeams);
            const next = jest.fn();

            await getAllTeams(mockReq, mockRes, next);

            expect(TeamService.getAllTeams).toHaveBeenCalledWith("1");
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                new ApiResponse(200, fakeTeams, "Teams fetched successfully")
            );
        });
    });

    describe("getTeamMembers", () => {
        it("should return 404 if team not found", async () => {
            mockReq.params = { teamId: "1" };
            (TeamService.getTeamMembers as jest.Mock).mockResolvedValue(null);
            const next = jest.fn();

            await getTeamMembers(mockReq, mockRes, next);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Team not found" });
        });

        it("should return members if team exists", async () => {
            const fakeTeam = { _id: "1", members: [{ _id: "2", name: "User" }] };
            mockReq.params = { teamId: "1" };
            (TeamService.getTeamMembers as jest.Mock).mockResolvedValue(fakeTeam);
            const next = jest.fn();

            await getTeamMembers(mockReq, mockRes, next);

            expect(TeamService.getTeamMembers).toHaveBeenCalledWith("1");
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                new ApiResponse(200, fakeTeam.members, "Member fetched successfully")
            );
        });
    });
});
