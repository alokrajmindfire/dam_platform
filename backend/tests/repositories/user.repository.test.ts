import { UserRepository } from "../../src/repositories/user.repository";
import { User } from "../../src/models/user.model";

jest.mock("../../src/models/user.model");

describe("UserRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should call User.findById with the correct userId", async () => {
      const mockUser = { _id: 123, email: "test@mail.com" };
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserRepository.findById(123);

      expect(User.findById).toHaveBeenCalledWith(123);
      expect(result).toEqual(mockUser);
    });
  });

  describe("findByEmail", () => {
    it("should call User.findOne with email filter", async () => {
      const mockUser = { _id: 123, email: "test@mail.com" };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserRepository.findByEmail("test@mail.com");

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@mail.com" });
      expect(result).toEqual(mockUser);
    });
  });

  describe("createUser", () => {
    it("should call User.create with user data", async () => {
      const data = { fullName: "John Doe", email: "john@mail.com", password: "secret" };
      const mockUser = { _id: "1", ...data };
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserRepository.createUser(data);

      expect(User.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockUser);
    });
  });

  describe("save", () => {
    it("should call save on the user instance", async () => {
      const mockSave = jest.fn().mockResolvedValue({ _id: "1", email: "saved@mail.com" });
      const mockUser = { save: mockSave };

      const result = await UserRepository.save(mockUser);

      expect(mockSave).toHaveBeenCalledWith({ validateBeforeSave: false });
      expect(result).toEqual({ _id: "1", email: "saved@mail.com" });
    });
  });

  describe("getPublicUsers", () => {
    it("should call User.find with profileVisibility filter", async () => {
      const mockUsers = [{ _id: "1", name: "John", email: "john@mail.com", role: "user" }];
      (User.find as jest.Mock).mockResolvedValue(mockUsers);

      const result = await UserRepository.getPublicUsers();

      expect(User.find).toHaveBeenCalledWith({ profileVisibility: "public" }, "name email role");
      expect(result).toEqual(mockUsers);
    });
  });

  describe("updateProfileVisibility", () => {
    it("should call User.findByIdAndUpdate with correct args", async () => {
      const mockUpdated = { _id: "1", profileVisibility: "public" };
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await UserRepository.updateProfileVisibility("1", "public");

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        { profileVisibility: "public" },
        { new: true }
      );
      expect(result).toEqual(mockUpdated);
    });
  });
});
