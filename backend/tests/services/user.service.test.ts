import { UserRepository } from "../../src/repositories/user.repository";
import * as UserServiceModule from "../../src/services/user.service";
import { UserService } from "../../src/services/user.service";
import { ApiError } from "../../src/utils/ApiError";

jest.mock("../../src/repositories/user.repository", () => ({
    UserRepository: {
        findById: jest.fn(),
        findByEmail: jest.fn(),
        createUser: jest.fn(),
        save: jest.fn(),
        selectWithoutPassword: jest.fn(),
        getPublicUsers: jest.fn(),
        updateProfileVisibility: jest.fn(),
    },
}));

describe("UserService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("registerUser", () => {
        it("should throw conflict if user exists", async () => {
            (UserRepository.findByEmail as jest.Mock).mockResolvedValue({ _id: "123" });

            await expect(
                UserService.registerUser("Test User", "test@mail.com", "password123")
            ).rejects.toThrow(ApiError);

            expect(UserRepository.findByEmail).toHaveBeenCalledWith("test@mail.com");
        });

        it("should register user successfully", async () => {
            (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
            (UserRepository.createUser as jest.Mock).mockResolvedValue({ _id: "1" });
            (UserRepository.selectWithoutPassword as jest.Mock).mockResolvedValue({
                _id: "1",
                fullName: "Test User",
                email: "test@mail.com",
            });

            const user = await UserService.registerUser("Test User", "test@mail.com", "password123");

            expect(user).toEqual({
                _id: "1",
                fullName: "Test User",
                email: "test@mail.com",
            });
        });
    });

    describe("loginUser", () => {
        it("should throw error if user does not exist", async () => {
            (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);

            await expect(
                UserService.loginUser("notfound@mail.com", "pass")
            ).rejects.toThrow("User does not exist");
        });

        it("should throw error if password is invalid", async () => {
            const fakeUser = { isPasswordCorrect: jest.fn().mockResolvedValue(false) };
            (UserRepository.findByEmail as jest.Mock).mockResolvedValue(fakeUser);

            await expect(
                UserService.loginUser("test@mail.com", "wrong")
            ).rejects.toThrow("Invalid user credentials");
        });

        it("should login user successfully", async () => {
            const fakeUser = {
                _id: "123",
                isPasswordCorrect: jest.fn().mockResolvedValue(true),
            };
            (UserRepository.findByEmail as jest.Mock).mockResolvedValue(fakeUser);

            jest.spyOn(UserServiceModule.UserService, "generateAccessToken")
                .mockResolvedValue("fakeToken");
            (UserRepository.selectWithoutPassword as jest.Mock).mockResolvedValue({
                _id: "123",
                email: "test@mail.com",
            });

            const result = await UserService.loginUser("test@mail.com", "password123");

            expect(result).toEqual({
                loggedInUser: { _id: "123", email: "test@mail.com" },
                accessToken: "fakeToken",
            });
        });
    });
});
