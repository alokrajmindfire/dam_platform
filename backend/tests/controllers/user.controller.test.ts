import * as UserServiceModule from "../../src/services/user.service";
import { registerUser, loginUser, logoutUser } from "../../src/controllers/user.controller";
import { ApiResponse } from "../../src/utils/ApiResponse";

jest.mock("../../src/services/user.service", () => ({
  UserService: {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
    generateAccessToken: jest.fn(),

  },
}));
const mockReq = (body = {}, user = null) => ({ body, user } as any);

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

describe("UserController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register and return user", async () => {
      const req = mockReq({ fullName: "Test User", email: "test@mail.com", password: "password123" });
      const res = mockRes();
      const next = jest.fn();

      (UserServiceModule.UserService.registerUser as jest.Mock).mockResolvedValue({
        _id: "1",
        email: "test@mail.com",
      });

      await registerUser(req, res, next);

      expect(UserServiceModule.UserService.registerUser).toHaveBeenCalledWith(
        "Test User", "test@mail.com", "password123"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.any(ApiResponse));
    });
  });

  describe("loginUser", () => {
    it("should login user and set cookie", async () => {
      const req = mockReq({ email: "test@mail.com", password: "password123" });
      const res = mockRes();
      const next = jest.fn();

      (UserServiceModule.UserService.loginUser as jest.Mock).mockResolvedValue({
        loggedInUser: { _id: "1", email: "test@mail.com" },
        accessToken: "fakeToken",
      });

      await loginUser(req, res, next);

      expect(UserServiceModule.UserService.loginUser).toHaveBeenCalledWith(
        "test@mail.com",
        "password123"
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "accessToken",
        "fakeToken",
        expect.any(Object)
      );
      expect(res.json).toHaveBeenCalledWith(expect.any(ApiResponse));
    });
  });

  describe("logoutUser", () => {
    it("should clear cookie and return response", async () => {
      const req = mockReq();
      const res = mockRes();
      const next = jest.fn();

      await logoutUser(req, res, next);

      expect(res.clearCookie).toHaveBeenCalledWith("accessToken", {
        httpOnly: true,
        secure: true,
      });
      expect(res.json).toHaveBeenCalledWith(expect.any(ApiResponse));
    });
  });
});
