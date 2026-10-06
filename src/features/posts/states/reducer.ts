import { createFlagReducer } from "@/helpers/thunkHelper";
import type { Post } from "@/types";
import type { AppAction } from "@/types/action";
import { ActionType } from "./action";

const EMPTY: AppAction = { type: "" };

export const postsReducer = (state: Post[] = [], action: AppAction = EMPTY) =>
  action.type === ActionType.SET_POSTS ? (action.payload as Post[]) : state;

export const postReducer = (state: Post | null = null, action: AppAction = EMPTY) =>
  action.type === ActionType.SET_POST ? (action.payload as Post | null) : state;

export const isPostReducer = createFlagReducer(ActionType.SET_IS_POST);
export const isPostAddReducer = createFlagReducer(ActionType.SET_IS_POST_ADD);
export const isPostAddedReducer = createFlagReducer(ActionType.SET_IS_POST_ADDED);
export const isPostChangeReducer = createFlagReducer(ActionType.SET_IS_POST_CHANGE);
export const isPostChangedReducer = createFlagReducer(ActionType.SET_IS_POST_CHANGED);
export const isPostChangeCoverReducer = createFlagReducer(ActionType.SET_IS_POST_CHANGE_COVER);
export const isPostChangedCoverReducer = createFlagReducer(ActionType.SET_IS_POST_CHANGED_COVER);
export const isPostDeleteReducer = createFlagReducer(ActionType.SET_IS_POST_DELETE);
export const isPostDeletedReducer = createFlagReducer(ActionType.SET_IS_POST_DELETED);
export const isPostLikeReducer = createFlagReducer(ActionType.SET_IS_POST_LIKE);
export const isPostLikedReducer = createFlagReducer(ActionType.SET_IS_POST_LIKED);
export const isPostAddCommentReducer = createFlagReducer(ActionType.SET_IS_POST_ADD_COMMENT);
export const isPostAddedCommentReducer = createFlagReducer(ActionType.SET_IS_POST_ADDED_COMMENT);
export const isPostDeleteCommentReducer = createFlagReducer(ActionType.SET_IS_POST_DELETE_COMMENT);
export const isPostDeletedCommentReducer = createFlagReducer(ActionType.SET_IS_POST_DELETED_COMMENT);
export const isPostDeleteAllReducer = createFlagReducer(ActionType.SET_IS_POST_DELETE_ALL);
export const isPostDeletedAllReducer = createFlagReducer(ActionType.SET_IS_POST_DELETED_ALL);
