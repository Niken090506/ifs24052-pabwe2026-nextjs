import { showErrorDialog } from "@/helpers/toolsHelper";
import { createMutationThunk, flagActionCreator } from "@/helpers/thunkHelper";
import type { AppDispatch } from "@/store";
import type { User } from "@/types";
import type { AppAction } from "@/types/action";
import userApi from "../api/userApi";

export const ActionType = {
  SET_USERS: "SET_USERS",
  SET_USER: "SET_USER",
  SET_PROFILE: "SET_PROFILE",
  SET_IS_PROFILE: "SET_IS_PROFILE",
  SET_IS_CHANGE_PROFILE: "SET_IS_CHANGE_PROFILE",
  SET_IS_CHANGE_PROFILE_PHOTO: "SET_IS_CHANGE_PROFILE_PHOTO",
  SET_IS_CHANGE_PROFILE_PASSWORD: "SET_IS_CHANGE_PROFILE_PASSWORD",
} as const;

export const setUsersActionCreator = (users: User[]): AppAction<User[]> => ({
  type: ActionType.SET_USERS,
  payload: users,
});

export const setUserActionCreator = (user: User | null): AppAction<User | null> => ({
  type: ActionType.SET_USER,
  payload: user,
});

export const setProfileActionCreator = (
  profile: User | null | undefined
): AppAction<User | null> => ({
  type: ActionType.SET_PROFILE,
  payload: profile ?? null,
});

export const setIsProfileActionCreator = flagActionCreator(ActionType.SET_IS_PROFILE);
export const setIsChangeProfileActionCreator = flagActionCreator(ActionType.SET_IS_CHANGE_PROFILE);
export const setIsChangeProfilePhotoActionCreator = flagActionCreator(ActionType.SET_IS_CHANGE_PROFILE_PHOTO);
export const setIsChangeProfilePasswordActionCreator = flagActionCreator(ActionType.SET_IS_CHANGE_PROFILE_PASSWORD);

export function asyncSetUsers() {
  return async (dispatch: AppDispatch) => {
    try {
      const users = await userApi.getUsers();
      dispatch(setUsersActionCreator(users));
    } catch (error) {
      dispatch(setUsersActionCreator([]));
      await showErrorDialog((error as Error).message);
    }
  };
}

// Mengembalikan true bila profil berhasil dimuat (dipakai route guarding)
export function asyncSetProfile() {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    dispatch(setIsProfileActionCreator(true));
    try {
      const profile = await userApi.getMe();
      dispatch(setProfileActionCreator(profile));
      return true;
    } catch (error) {
      dispatch(setProfileActionCreator(null));
      await showErrorDialog((error as Error).message);
      return false;
    } finally {
      dispatch(setIsProfileActionCreator(false));
    }
  };
}

const refreshProfile = async (dispatch: AppDispatch) => {
  try {
    dispatch(setProfileActionCreator(await userApi.getMe()));
  } catch {
    // profil lama tetap dipakai bila penyegaran gagal
  }
};

export function asyncChangeProfile(name: string, email: string) {
  const thunk = createMutationThunk({
    setStart: setIsChangeProfileActionCreator,
    run: () => userApi.putMe(name, email),
  });
  return async (dispatch: AppDispatch) => {
    const ok = await thunk(dispatch);
    if (ok) {
      await refreshProfile(dispatch);
    }
    return ok;
  };
}

export function asyncChangeProfilePhoto(photo: File) {
  const thunk = createMutationThunk({
    setStart: setIsChangeProfilePhotoActionCreator,
    run: () => userApi.postMePhoto(photo),
  });
  return async (dispatch: AppDispatch) => {
    const ok = await thunk(dispatch);
    if (ok) {
      await refreshProfile(dispatch);
    }
    return ok;
  };
}

export function asyncChangeProfilePassword(password: string, newPassword: string) {
  return createMutationThunk({
    setStart: setIsChangeProfilePasswordActionCreator,
    run: () => userApi.putMePassword(password, newPassword),
  });
}
