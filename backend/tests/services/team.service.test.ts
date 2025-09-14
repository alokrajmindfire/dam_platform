import { TeamService } from "../../src/services/team.service";
import { TeamRepository } from "../../src/repositories/team.repository";
import { ApiError } from "../../src/utils/ApiError";
import { Schema, Types } from "mongoose";

jest.mock("../../src/repositories/team.repository");

describe("TeamService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createTeam", () => {
        it("should create a team and return it", async () => {
            const fakeTeam = { _id: "1", name: "Team 1" };
            (TeamRepository.createTeam as jest.Mock).mockResolvedValue(fakeTeam);

            const ownerId = new Types.ObjectId() as unknown as Schema.Types.ObjectId;

            const result = await TeamService.createTeam("Team 1", "desc", ownerId, "admin");

            expect(TeamRepository.createTeam).toHaveBeenCalledWith({
                name: "Team 1",
                description: "desc",
                ownerId,
                role: "admin",
            });
            expect(result).toEqual(fakeTeam);
        });
    });

    describe("addMember", () => {
        it("should throw ApiError if team not found", async () => {
            (TeamRepository.findById as jest.Mock).mockResolvedValue(null);

            const userId = new Types.ObjectId() as unknown as Schema.Types.ObjectId;

            await expect(
                TeamService.addMember("team1", userId, "member")
            ).rejects.toThrow(ApiError);

            expect(TeamRepository.findById).toHaveBeenCalledWith("team1");
        });

        it("should add a member if team exists", async () => {
            const fakeTeam = { _id: "team1" };
            const updatedTeam = { _id: "team1", members: [{ _id: "user1", role: "member" }] };

            (TeamRepository.findById as jest.Mock).mockResolvedValue(fakeTeam);
            (TeamRepository.addMember as jest.Mock).mockResolvedValue(updatedTeam);

            const userId = new Types.ObjectId() as unknown as Schema.Types.ObjectId;
            const result = await TeamService.addMember("team1", userId, "member");

            expect(TeamRepository.findById).toHaveBeenCalledWith("team1");
            expect(TeamRepository.addMember).toHaveBeenCalledWith("team1", userId, "member");
            expect(result).toEqual(updatedTeam);
        });
    });

    describe("getAllTeams", () => {
        it("should return all teams for a user", async () => {
            const fakeTeams = [{ _id: "team1" }];
            (TeamRepository.getAllTeams as jest.Mock).mockResolvedValue(fakeTeams);

            const result = await TeamService.getAllTeams("user1");

            expect(TeamRepository.getAllTeams).toHaveBeenCalledWith("user1");
            expect(result).toEqual(fakeTeams);
        });
    });

    describe("getTeamMembers", () => {
        it("should return team members", async () => {
            const fakeTeam = { _id: "team1", members: [{ _id: "user1" }] };
            (TeamRepository.getTeamMembers as jest.Mock).mockResolvedValue(fakeTeam);

            const result = await TeamService.getTeamMembers("team1");

            expect(TeamRepository.getTeamMembers).toHaveBeenCalledWith("team1");
            expect(result).toEqual(fakeTeam);
        });
    });
});
