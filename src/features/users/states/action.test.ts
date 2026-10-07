import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setUsersActionCreator,
  setUserActionCreator,
  setProfileActionCreator,
  setIsProfileActionCreator,
  setIsChangeProfileActionCreator,
  setIsChangeProfilePhotoActionCreator,
  setIsChangeProfilePasswordActionCreator,
  asyncSetUsers,
  asyncSetProfile,
  asyncChangeProfile,
  asyncChangeProfilePhoto,
  asyncChangeProfilePassword,
} from "./action";
import userApi from "../api/userApi";
import * as toolsHelper from "@/helpers/toolsHelper";
import type { User } from "@/types";

describe("users action", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create correct action objects", () => {
    const dummyUser: User = { id: "1", name: "User 1" };
    expect(setUsersActionCreator([dummyUser])).toEqual({
      type: ActionType.SET_USERS,
      payload: [dummyUser],
    });
    expect(setUserActionCreator(dummyUser)).toEqual({
      type: ActionType.SET_USER,
      payload: dummyUser,
    });
    expect(setUserActionCreator(null)).toEqual({
      type: ActionType.SET_USER,
      payload: null,
    });
    expect(setProfileActionCreator(dummyUser)).toEqual({
      type: ActionType.SET_PROFILE,
      payload: dummyUser,
    });
    expect(setProfileActionCreator(null)).toEqual({
      type: ActionType.SET_PROFILE,
      payload: null,
    });
    expect(setProfileActionCreator(undefined)).toEqual({
      type: ActionType.SET_PROFILE,
      payload: null,
    });
    expect(setIsProfileActionCreator(true)).toEqual({
      type: ActionType.SET_IS_PROFILE,
      payload: true,
    });
    expect(setIsChangeProfileActionCreator(true)).toEqual({
      type: ActionType.SET_IS_CHANGE_PROFILE,
      payload: true,
    });
    expect(setIsChangeProfilePhotoActionCreator(true)).toEqual({
      type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO,
      payload: true,
    });
    expect(setIsChangeProfilePasswordActionCreator(true)).toEqual({
      type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD,
      payload: true,
    });
  });

  describe("asyncSetUsers", () => {
    it("should dispatch setUsersActionCreator with users on success", async () => {
      const dispatch = vi.fn();
      const users: User[] = [{ id: "1", name: "User 1" }];
      vi.spyOn(userApi, "getUsers").mockResolvedValue(users);

      await asyncSetUsers()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setUsersActionCreator(users));
    });

    it("should dispatch empty array and show error dialog on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "getUsers").mockRejectedValue(new Error("Network Error"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      await asyncSetUsers()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setUsersActionCreator([]));
      expect(errorSpy).toHaveBeenCalledWith("Network Error");
    });
  });

  describe("asyncSetProfile", () => {
    it("should set profile and return true on success", async () => {
      const dispatch = vi.fn();
      const profile: User = { id: "1", name: "My Profile" };
      vi.spyOn(userApi, "getMe").mockResolvedValue(profile);

      const result = await asyncSetProfile()(dispatch);

      expect(result).toBe(true);
      expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator(profile));
      expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(false));
    });

    it("should set profile to null and return false on error", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "getMe").mockRejectedValue(new Error("Failed profile"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      const result = await asyncSetProfile()(dispatch);

      expect(result).toBe(false);
      expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator(null));
      expect(errorSpy).toHaveBeenCalledWith("Failed profile");
      expect(dispatch).toHaveBeenCalledWith(setIsProfileActionCreator(false));
    });
  });

  describe("asyncChangeProfile", () => {
    it("should update profile and refresh profile on success", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "putMe").mockResolvedValue("Profil diperbarui");
      const updatedProfile: User = { id: "1", name: "New Name", email: "new@del.org" };
      vi.spyOn(userApi, "getMe").mockResolvedValue(updatedProfile);
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      const result = await asyncChangeProfile("New Name", "new@del.org")(dispatch);

      expect(result).toBe(true);
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator(updatedProfile));
    });

    it("should handle error when refreshProfile throws", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "putMe").mockResolvedValue("Profil diperbarui");
      vi.spyOn(userApi, "getMe").mockRejectedValue(new Error("Refresh failed"));
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      const result = await asyncChangeProfile("New Name", "new@del.org")(dispatch);

      expect(result).toBe(true);
    });

    it("should return false on failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "putMe").mockRejectedValue(new Error("Gagal"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      const result = await asyncChangeProfile("New Name", "new@del.org")(dispatch);

      expect(result).toBe(false);
    });
  });

  describe("asyncChangeProfilePhoto", () => {
    it("should update profile photo and refresh profile on success", async () => {
      const dispatch = vi.fn();
      const file = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
      vi.spyOn(userApi, "postMePhoto").mockResolvedValue("Foto profil diubah");
      const updatedProfile: User = { id: "1", name: "Name", photo: "new.jpg" };
      vi.spyOn(userApi, "getMe").mockResolvedValue(updatedProfile);
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      const result = await asyncChangeProfilePhoto(file)(dispatch);

      expect(result).toBe(true);
      expect(dispatch).toHaveBeenCalledWith(setProfileActionCreator(updatedProfile));
    });

    it("should handle refresh error in asyncChangeProfilePhoto", async () => {
      const dispatch = vi.fn();
      const file = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
      vi.spyOn(userApi, "postMePhoto").mockResolvedValue("Foto profil diubah");
      vi.spyOn(userApi, "getMe").mockRejectedValue(new Error("Refresh failed"));
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      const result = await asyncChangeProfilePhoto(file)(dispatch);

      expect(result).toBe(true);
    });

    it("should return false on failure", async () => {
      const dispatch = vi.fn();
      const file = new File(["dummy"], "photo.jpg", { type: "image/jpeg" });
      vi.spyOn(userApi, "postMePhoto").mockRejectedValue(new Error("Gagal"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      const result = await asyncChangeProfilePhoto(file)(dispatch);

      expect(result).toBe(false);
    });
  });

  describe("asyncChangeProfilePassword", () => {
    it("should change password successfully", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "putMePassword").mockResolvedValue("Password diubah");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      const thunk = asyncChangeProfilePassword("old123", "new123");
      const result = await thunk(dispatch);

      expect(result).toBe(true);
    });

    it("should handle failure when changing password", async () => {
      const dispatch = vi.fn();
      vi.spyOn(userApi, "putMePassword").mockRejectedValue(new Error("Password salah"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      const thunk = asyncChangeProfilePassword("old123", "new123");
      const result = await thunk(dispatch);

      expect(result).toBe(false);
    });
  });
});
