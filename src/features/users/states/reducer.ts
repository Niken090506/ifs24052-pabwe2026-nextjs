import { createFlagReducer } from "@/helpers/thunkHelper";
import type { User } from "@/types";
import type { AppAction } from "@/types/action";
import { ActionType } from "./action";

const EMPTY: AppAction = { type: "" };

export const usersReducer = (state: User[] = [], action: AppAction = EMPTY) =>
  action.type === ActionType.SET_USERS ? (action.payload as User[]) : state;

export const userReducer = (state: User | null = null, action: AppAction = EMPTY) =>
  action.type === ActionType.SET_USER ? (action.payload as User | null) : state;

export const profileReducer = (state: User | null = null, action: AppAction = EMPTY) =>
  action.type === ActionType.SET_PROFILE ? (action.payload as User | null) : state;

export const isProfileReducer = createFlagReducer(ActionType.SET_IS_PROFILE);
export const isChangeProfileReducer = createFlagReducer(ActionType.SET_IS_CHANGE_PROFILE);
export const isChangeProfilePhotoReducer = createFlagReducer(ActionType.SET_IS_CHANGE_PROFILE_PHOTO);
export const isChangeProfilePasswordReducer = createFlagReducer(ActionType.SET_IS_CHANGE_PROFILE_PASSWORD);
