import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ActionType,
  setPostsActionCreator,
  setPostActionCreator,
  setIsPostActionCreator,
  setIsPostAddActionCreator,
  setIsPostAddedActionCreator,
  setIsPostChangeActionCreator,
  setIsPostChangedActionCreator,
  setIsPostChangeCoverActionCreator,
  setIsPostChangedCoverActionCreator,
  setIsPostDeleteActionCreator,
  setIsPostDeletedActionCreator,
  setIsPostLikeActionCreator,
  setIsPostLikedActionCreator,
  setIsPostAddCommentActionCreator,
  setIsPostAddedCommentActionCreator,
  setIsPostDeleteCommentActionCreator,
  setIsPostDeletedCommentActionCreator,
  setIsPostDeleteAllActionCreator,
  setIsPostDeletedAllActionCreator,
  asyncSetPosts,
  asyncSetPost,
  asyncAddPost,
  asyncChangePost,
  asyncChangePostCover,
  asyncDeletePost,
  asyncLikePost,
  asyncAddComment,
  asyncDeleteComment,
  asyncDeleteAllPosts,
} from "./action";
import postApi from "../api/postApi";
import * as toolsHelper from "@/helpers/toolsHelper";
import type { Post } from "@/types";

describe("posts action", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create action objects correctly", () => {
    const dummyPost: Post = { id: "p1", description: "Hello" };
    expect(setPostsActionCreator([dummyPost])).toEqual({
      type: ActionType.SET_POSTS,
      payload: [dummyPost],
    });
    expect(setPostActionCreator(dummyPost)).toEqual({
      type: ActionType.SET_POST,
      payload: dummyPost,
    });
    expect(setIsPostActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST,
      payload: true,
    });
    expect(setIsPostAddActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_ADD,
      payload: true,
    });
    expect(setIsPostAddedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_ADDED,
      payload: true,
    });
    expect(setIsPostChangeActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_CHANGE,
      payload: true,
    });
    expect(setIsPostChangedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_CHANGED,
      payload: true,
    });
    expect(setIsPostChangeCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_CHANGE_COVER,
      payload: true,
    });
    expect(setIsPostChangedCoverActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_CHANGED_COVER,
      payload: true,
    });
    expect(setIsPostDeleteActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETE,
      payload: true,
    });
    expect(setIsPostDeletedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETED,
      payload: true,
    });
    expect(setIsPostLikeActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_LIKE,
      payload: true,
    });
    expect(setIsPostLikedActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_LIKED,
      payload: true,
    });
    expect(setIsPostAddCommentActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_ADD_COMMENT,
      payload: true,
    });
    expect(setIsPostAddedCommentActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_ADDED_COMMENT,
      payload: true,
    });
    expect(setIsPostDeleteCommentActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETE_COMMENT,
      payload: true,
    });
    expect(setIsPostDeletedCommentActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETED_COMMENT,
      payload: true,
    });
    expect(setIsPostDeleteAllActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETE_ALL,
      payload: true,
    });
    expect(setIsPostDeletedAllActionCreator(true)).toEqual({
      type: ActionType.SET_IS_POST_DELETED_ALL,
      payload: true,
    });
  });

  describe("asyncSetPosts", () => {
    it("should fetch posts and dispatch successfully", async () => {
      const dispatch = vi.fn();
      const posts: Post[] = [{ id: "p1", description: "Test" }];
      vi.spyOn(postApi, "getPosts").mockResolvedValue(posts);

      await asyncSetPosts(true)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setPostsActionCreator(posts));
      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(false));
    });

    it("should handle error in asyncSetPosts", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "getPosts").mockRejectedValue(new Error("Net error"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      await asyncSetPosts()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setPostsActionCreator([]));
      expect(errorSpy).toHaveBeenCalledWith("Net error");
      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(false));
    });
  });

  describe("asyncSetPost", () => {
    it("should fetch single post and dispatch successfully", async () => {
      const dispatch = vi.fn();
      const post: Post = { id: "p1", description: "Single post" };
      vi.spyOn(postApi, "getPostById").mockResolvedValue(post);

      await asyncSetPost("p1")(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setPostActionCreator(post));
      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(false));
    });

    it("should handle error in asyncSetPost", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "getPostById").mockRejectedValue(new Error("Not found"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      await asyncSetPost("p99")(dispatch);

      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setPostActionCreator(null));
      expect(errorSpy).toHaveBeenCalledWith("Not found");
      expect(dispatch).toHaveBeenCalledWith(setIsPostActionCreator(false));
    });
  });

  describe("mutation thunks", () => {
    it("asyncAddPost success and failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postPost").mockResolvedValue("Success");
      const ok = await asyncAddPost("Description")(dispatch);
      expect(ok).toBe(true);

      vi.spyOn(postApi, "postPost").mockRejectedValue(new Error("Fail"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
      const fail = await asyncAddPost("Description")(dispatch);
      expect(fail).toBe(false);
    });

    it("asyncChangePost success and failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "putPost").mockResolvedValue("Changed");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const ok = await asyncChangePost("p1", "New desc")(dispatch);
      expect(ok).toBe(true);

      vi.spyOn(postApi, "putPost").mockRejectedValue(new Error("Fail"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
      const fail = await asyncChangePost("p1", "New desc")(dispatch);
      expect(fail).toBe(false);
    });

    it("asyncChangePostCover success and failure", async () => {
      const dispatch = vi.fn();
      const file = new File(["dummy"], "cover.png", { type: "image/png" });
      vi.spyOn(postApi, "postPostCover").mockResolvedValue("Cover updated");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const ok = await asyncChangePostCover("p1", file)(dispatch);
      expect(ok).toBe(true);

      vi.spyOn(postApi, "postPostCover").mockRejectedValue(new Error("Fail"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
      const fail = await asyncChangePostCover("p1", file)(dispatch);
      expect(fail).toBe(false);
    });

    it("asyncDeletePost success and failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deletePost").mockResolvedValue("Deleted");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const ok = await asyncDeletePost("p1")(dispatch);
      expect(ok).toBe(true);

      vi.spyOn(postApi, "deletePost").mockRejectedValue(new Error("Fail"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
      const fail = await asyncDeletePost("p1")(dispatch);
      expect(fail).toBe(false);
    });

    it("asyncLikePost success and failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postLike").mockResolvedValue("Liked");
      const ok = await asyncLikePost("p1")(dispatch);
      expect(ok).toBe(true);

      vi.spyOn(postApi, "postLike").mockRejectedValue(new Error("Fail"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
      const fail = await asyncLikePost("p1")(dispatch);
      expect(fail).toBe(false);
    });

    it("asyncAddComment success and failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "postComment").mockResolvedValue("Comment added");
      const ok = await asyncAddComment("p1", "Nice")(dispatch);
      expect(ok).toBe(true);

      vi.spyOn(postApi, "postComment").mockRejectedValue(new Error("Fail"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
      const fail = await asyncAddComment("p1", "Nice")(dispatch);
      expect(fail).toBe(false);
    });

    it("asyncDeleteComment success and failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deleteComment").mockResolvedValue("Comment deleted");
      const ok = await asyncDeleteComment("p1", "c1")(dispatch);
      expect(ok).toBe(true);

      vi.spyOn(postApi, "deleteComment").mockRejectedValue(new Error("Fail"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
      const fail = await asyncDeleteComment("p1", "c1")(dispatch);
      expect(fail).toBe(false);
    });

    it("asyncDeleteAllPosts success and failure", async () => {
      const dispatch = vi.fn();
      vi.spyOn(postApi, "deleteAllPosts").mockResolvedValue("All deleted");
      vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);
      const ok = await asyncDeleteAllPosts()(dispatch);
      expect(ok).toBe(true);

      vi.spyOn(postApi, "deleteAllPosts").mockRejectedValue(new Error("Fail"));
      vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);
      const fail = await asyncDeleteAllPosts()(dispatch);
      expect(fail).toBe(false);
    });
  });
});
