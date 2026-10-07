import { describe, it, expect, vi, beforeEach } from "vitest";
import authApi from "./authApi";
import apiHelper from "@/helpers/apiHelper";

describe("authApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("postRegister", () => {
    it("should return message on success response", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil melakukan pendaftaran",
        }),
      } as any);

      const message = await authApi.postRegister("Delcom", "delcom@org.id", "123456");
      expect(message).toBe("Berhasil melakukan pendaftaran");
    });

    it("should throw error when api returns fail", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
        }),
      } as any);

      await expect(
        authApi.postRegister("Delcom", "delcom@org.id", "123456")
      ).rejects.toThrow("Data tidak valid");
    });

    it("should use default fallback message when message is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(
        authApi.postRegister("Delcom", "delcom@org.id", "123456")
      ).rejects.toThrow("Gagal mendaftarkan akun");
    });

    it("should handle when data object has no error messages", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
          data: {},
        }),
      } as any);

      await expect(
        authApi.postRegister("Delcom", "delcom@org.id", "123")
      ).rejects.toThrow("Data tidak valid");
    });

    it("should handle error when message is present", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Data tidak valid",
          data: {
            email: ["Email sudah terdaftar."],
          },
        }),
      } as any);

      await expect(
        authApi.postRegister("Delcom", "delcom@org.id", "123")
      ).rejects.toThrow("Data tidak valid");
    });
  });

  describe("postLogin", () => {
    it("should return data on success response", async () => {
      const mockData = {
        token: "fake-jwt",
      };

      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: mockData,
        }),
      } as any);

      const data = await authApi.postLogin("test@delcom.org", "123456");
      expect(data).toEqual(mockData);
    });

    it("should throw error when login fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Kredensial akun tidak ditemukan",
        }),
      } as any);

      await expect(
        authApi.postLogin("wrong@delcom.org", "wrong")
      ).rejects.toThrow("Kredensial akun tidak ditemukan");
    });

    it("should use default fallback error message when missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(
        authApi.postLogin("wrong@delcom.org", "wrong")
      ).rejects.toThrow("Gagal masuk ke akun");
    });
  });

  describe("postLogout", () => {
    it("should return message on success logout", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Berhasil logout",
        }),
      } as any);

      const message = await authApi.postLogout();
      expect(message).toBe("Berhasil logout");
    });

    it("should throw error when logout fails", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
          message: "Token tidak sah",
        }),
      } as any);

      await expect(authApi.postLogout()).rejects.toThrow("Token tidak sah");
    });

    it("should use default fallback message when missing on logout failure", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "fail",
        }),
      } as any);

      await expect(authApi.postLogout()).rejects.toThrow("Gagal keluar dari akun");
    });
  });
});
