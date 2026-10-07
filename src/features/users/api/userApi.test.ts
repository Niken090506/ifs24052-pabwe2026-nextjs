import { describe, it, expect, vi, beforeEach } from "vitest";
import userApi from "./userApi";
import apiHelper from "@/helpers/apiHelper";

describe("userApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getUsers", () => {
    it("should return users array on success", async () => {
      const mockUsers = [{ id: "1", name: "User 1" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { users: mockUsers },
        }),
      } as any);

      const users = await userApi.getUsers();
      expect(users).toEqual(mockUsers);
    });

    it("should return empty array if data.users is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      } as any);

      const users = await userApi.getUsers();
      expect(users).toEqual([]);
    });

    it("should throw error when api status is not success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
        }),
      } as any);

      await expect(userApi.getUsers()).rejects.toThrow("Data tidak valid");
    });
  });

  describe("getMe", () => {
    it("should return profile user object on success", async () => {
      const mockUser = { id: "1", name: "Profile" };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { user: mockUser },
        }),
      } as any);

      const user = await userApi.getMe();
      expect(user).toEqual(mockUser);
    });

    it("should throw error on fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Akses ditolak",
        }),
      } as any);

      await expect(userApi.getMe()).rejects.toThrow("Akses ditolak");
    });
  });

  describe("putMe", () => {
    it("should update profile and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Profil diperbarui",
        }),
      } as any);

      const msg = await userApi.putMe("Updated Name", "updated@del.org");
      expect(msg).toBe("Profil diperbarui");
    });

    it("should throw error on failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Gagal mengubah profil",
        }),
      } as any);

      await expect(userApi.putMe("Updated Name", "updated@del.org")).rejects.toThrow(
        "Gagal mengubah profil"
      );
    });
  });

  describe("postMePhoto", () => {
    it("should post photo with name and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Foto profil diubah",
        }),
      } as any);

      const file = new File(["dummy"], "photo.png", { type: "image/png" });
      const msg = await userApi.postMePhoto(file);
      expect(msg).toBe("Foto profil diubah");
    });

    it("should handle photo file without name properly", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Foto profil diubah",
        }),
      } as any);

      const file = new File(["dummy"], "", { type: "image/png" });
      const msg = await userApi.postMePhoto(file);
      expect(msg).toBe("Foto profil diubah");
    });

    it("should throw error on photo upload failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "File tidak didukung",
        }),
      } as any);

      const file = new File(["dummy"], "photo.png", { type: "image/png" });
      await expect(userApi.postMePhoto(file)).rejects.toThrow("File tidak didukung");
    });
  });

  describe("putMePassword", () => {
    it("should update password and return message on success", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Kata sandi diubah",
        }),
      } as any);

      const msg = await userApi.putMePassword("old123", "new123");
      expect(msg).toBe("Kata sandi diubah");
    });

    it("should throw error on failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Kata sandi salah",
        }),
      } as any);

      await expect(userApi.putMePassword("wrong", "new123")).rejects.toThrow("Kata sandi salah");
    });
  });
});
