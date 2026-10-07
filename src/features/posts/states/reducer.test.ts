import { describe, expect, it } from "vitest";
import {
  isPostReducer,
  isPostAddReducer,
  isPostAddedReducer,
  isPostChangeReducer,
  isPostChangedReducer,
  isPostChangeCoverReducer,
  isPostChangedCoverReducer,
  isPostDeleteReducer,
  isPostDeletedReducer,
  isPostLikeReducer,
  isPostLikedReducer,
  isPostAddCommentReducer,
  isPostAddedCommentReducer,
  isPostDeleteCommentReducer,
  isPostDeletedCommentReducer,
  isPostDeleteAllReducer,
  isPostDeletedAllReducer,
  postsReducer,
  postReducer,
} from "./reducer";
import { ActionType } from "./action";

describe("Posts Reducers", () => {
  it("should return default state when called without arguments", () => {
    expect(postsReducer()).toEqual([]);
    expect(postReducer()).toBeNull();
    expect(isPostReducer()).toBe(false);
  });

  it("should set posts", () => {
    const posts = [{ id: "1", description: "Post 1" }];
    expect(postsReducer([], { type: ActionType.SET_POSTS, payload: posts })).toEqual(posts);
  });

  it("should return initial posts for unknown action", () => {
    expect(postsReducer([], { type: "UNKNOWN" })).toEqual([]);
  });

  it("should set post", () => {
    const post = { id: "1", description: "Post 1" };
    expect(postReducer(null, { type: ActionType.SET_POST, payload: post })).toEqual(post);
  });

  it("should return initial post for unknown action", () => {
    expect(postReducer(null, { type: "UNKNOWN" })).toBeNull();
  });

  it("should set isPost", () => {
    expect(isPostReducer(false, { type: ActionType.SET_IS_POST, payload: true })).toBe(true);
  });

  it("should set post action flags", () => {
    expect(isPostAddReducer(false, { type: ActionType.SET_IS_POST_ADD, payload: true })).toBe(true);
    expect(isPostAddedReducer(false, { type: ActionType.SET_IS_POST_ADDED, payload: true })).toBe(true);
    expect(isPostChangeReducer(false, { type: ActionType.SET_IS_POST_CHANGE, payload: true })).toBe(true);
    expect(isPostChangedReducer(false, { type: ActionType.SET_IS_POST_CHANGED, payload: true })).toBe(true);
    expect(isPostChangeCoverReducer(false, { type: ActionType.SET_IS_POST_CHANGE_COVER, payload: true })).toBe(true);
    expect(isPostChangedCoverReducer(false, { type: ActionType.SET_IS_POST_CHANGED_COVER, payload: true })).toBe(true);
    expect(isPostDeleteReducer(false, { type: ActionType.SET_IS_POST_DELETE, payload: true })).toBe(true);
    expect(isPostDeletedReducer(false, { type: ActionType.SET_IS_POST_DELETED, payload: true })).toBe(true);
    expect(isPostLikeReducer(false, { type: ActionType.SET_IS_POST_LIKE, payload: true })).toBe(true);
    expect(isPostLikedReducer(false, { type: ActionType.SET_IS_POST_LIKED, payload: true })).toBe(true);
    expect(isPostAddCommentReducer(false, { type: ActionType.SET_IS_POST_ADD_COMMENT, payload: true })).toBe(true);
    expect(isPostAddedCommentReducer(false, { type: ActionType.SET_IS_POST_ADDED_COMMENT, payload: true })).toBe(true);
    expect(isPostDeleteCommentReducer(false, { type: ActionType.SET_IS_POST_DELETE_COMMENT, payload: true })).toBe(true);
    expect(isPostDeletedCommentReducer(false, { type: ActionType.SET_IS_POST_DELETED_COMMENT, payload: true })).toBe(true);
    expect(isPostDeleteAllReducer(false, { type: ActionType.SET_IS_POST_DELETE_ALL, payload: true })).toBe(true);
    expect(isPostDeletedAllReducer(false, { type: ActionType.SET_IS_POST_DELETED_ALL, payload: true })).toBe(true);
  });

  it("should return current state for unknown flag actions", () => {
    expect(isPostReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostAddReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostAddedReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostChangeReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostChangedReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostChangeCoverReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostChangedCoverReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostDeleteReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostDeletedReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostLikeReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostLikedReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostAddCommentReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostAddedCommentReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostDeleteCommentReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostDeletedCommentReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostDeleteAllReducer(true, { type: "UNKNOWN" })).toBe(true);
    expect(isPostDeletedAllReducer(true, { type: "UNKNOWN" })).toBe(true);
  });
});