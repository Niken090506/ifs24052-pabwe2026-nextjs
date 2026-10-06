import { showErrorDialog } from "@/helpers/toolsHelper";
import { createMutationThunk, flagActionCreator } from "@/helpers/thunkHelper";
import type { AppDispatch } from "@/store";
import type { Post } from "@/types";
import type { AppAction } from "@/types/action";
import postApi from "../api/postApi";

export const ActionType = {
  SET_POSTS: "SET_POSTS",
  SET_POST: "SET_POST",
  SET_IS_POST: "SET_IS_POST",
  SET_IS_POST_ADD: "SET_IS_POST_ADD",
  SET_IS_POST_ADDED: "SET_IS_POST_ADDED",
  SET_IS_POST_CHANGE: "SET_IS_POST_CHANGE",
  SET_IS_POST_CHANGED: "SET_IS_POST_CHANGED",
  SET_IS_POST_CHANGE_COVER: "SET_IS_POST_CHANGE_COVER",
  SET_IS_POST_CHANGED_COVER: "SET_IS_POST_CHANGED_COVER",
  SET_IS_POST_DELETE: "SET_IS_POST_DELETE",
  SET_IS_POST_DELETED: "SET_IS_POST_DELETED",
  SET_IS_POST_LIKE: "SET_IS_POST_LIKE",
  SET_IS_POST_LIKED: "SET_IS_POST_LIKED",
  SET_IS_POST_ADD_COMMENT: "SET_IS_POST_ADD_COMMENT",
  SET_IS_POST_ADDED_COMMENT: "SET_IS_POST_ADDED_COMMENT",
  SET_IS_POST_DELETE_COMMENT: "SET_IS_POST_DELETE_COMMENT",
  SET_IS_POST_DELETED_COMMENT: "SET_IS_POST_DELETED_COMMENT",
  SET_IS_POST_DELETE_ALL: "SET_IS_POST_DELETE_ALL",
  SET_IS_POST_DELETED_ALL: "SET_IS_POST_DELETED_ALL",
} as const;

export const setPostsActionCreator = (posts: Post[]): AppAction<Post[]> => ({
  type: ActionType.SET_POSTS,
  payload: posts,
});

export const setPostActionCreator = (post: Post | null): AppAction<Post | null> => ({
  type: ActionType.SET_POST,
  payload: post,
});

export const setIsPostActionCreator = flagActionCreator(ActionType.SET_IS_POST);
export const setIsPostAddActionCreator = flagActionCreator(ActionType.SET_IS_POST_ADD);
export const setIsPostAddedActionCreator = flagActionCreator(ActionType.SET_IS_POST_ADDED);
export const setIsPostChangeActionCreator = flagActionCreator(ActionType.SET_IS_POST_CHANGE);
export const setIsPostChangedActionCreator = flagActionCreator(ActionType.SET_IS_POST_CHANGED);
export const setIsPostChangeCoverActionCreator = flagActionCreator(ActionType.SET_IS_POST_CHANGE_COVER);
export const setIsPostChangedCoverActionCreator = flagActionCreator(ActionType.SET_IS_POST_CHANGED_COVER);
export const setIsPostDeleteActionCreator = flagActionCreator(ActionType.SET_IS_POST_DELETE);
export const setIsPostDeletedActionCreator = flagActionCreator(ActionType.SET_IS_POST_DELETED);
export const setIsPostLikeActionCreator = flagActionCreator(ActionType.SET_IS_POST_LIKE);
export const setIsPostLikedActionCreator = flagActionCreator(ActionType.SET_IS_POST_LIKED);
export const setIsPostAddCommentActionCreator = flagActionCreator(ActionType.SET_IS_POST_ADD_COMMENT);
export const setIsPostAddedCommentActionCreator = flagActionCreator(ActionType.SET_IS_POST_ADDED_COMMENT);
export const setIsPostDeleteCommentActionCreator = flagActionCreator(ActionType.SET_IS_POST_DELETE_COMMENT);
export const setIsPostDeletedCommentActionCreator = flagActionCreator(ActionType.SET_IS_POST_DELETED_COMMENT);
export const setIsPostDeleteAllActionCreator = flagActionCreator(ActionType.SET_IS_POST_DELETE_ALL);
export const setIsPostDeletedAllActionCreator = flagActionCreator(ActionType.SET_IS_POST_DELETED_ALL);

export function asyncSetPosts(isMe = false) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostActionCreator(true));
    try {
      const posts = await postApi.getPosts(isMe);
      dispatch(setPostsActionCreator(posts));
    } catch (error) {
      dispatch(setPostsActionCreator([]));
      await showErrorDialog((error as Error).message);
    } finally {
      dispatch(setIsPostActionCreator(false));
    }
  };
}

export function asyncSetPost(postId: string) {
  return async (dispatch: AppDispatch) => {
    dispatch(setIsPostActionCreator(true));
    try {
      const post = await postApi.getPostById(postId);
      dispatch(setPostActionCreator(post));
    } catch (error) {
      dispatch(setPostActionCreator(null));
      await showErrorDialog((error as Error).message);
    } finally {
      dispatch(setIsPostActionCreator(false));
    }
  };
}

export const asyncAddPost = (description: string) =>
  createMutationThunk({
    setStart: setIsPostAddActionCreator,
    setDone: setIsPostAddedActionCreator,
    run: () => postApi.postPost(description),
    showSuccess: false,
  });

export const asyncChangePost = (postId: string, description: string) =>
  createMutationThunk({
    setStart: setIsPostChangeActionCreator,
    setDone: setIsPostChangedActionCreator,
    run: () => postApi.putPost(postId, description),
  });

export const asyncChangePostCover = (postId: string, cover: File) =>
  createMutationThunk({
    setStart: setIsPostChangeCoverActionCreator,
    setDone: setIsPostChangedCoverActionCreator,
    run: () => postApi.postPostCover(postId, cover),
  });

export const asyncDeletePost = (postId: string) =>
  createMutationThunk({
    setStart: setIsPostDeleteActionCreator,
    setDone: setIsPostDeletedActionCreator,
    run: () => postApi.deletePost(postId),
  });

export const asyncLikePost = (postId: string) =>
  createMutationThunk({
    setStart: setIsPostLikeActionCreator,
    setDone: setIsPostLikedActionCreator,
    run: () => postApi.postLike(postId),
    showSuccess: false,
  });

export const asyncAddComment = (postId: string, comment: string) =>
  createMutationThunk({
    setStart: setIsPostAddCommentActionCreator,
    setDone: setIsPostAddedCommentActionCreator,
    run: () => postApi.postComment(postId, comment),
    showSuccess: false,
  });

export const asyncDeleteComment = (postId: string, commentId: string) =>
  createMutationThunk({
    setStart: setIsPostDeleteCommentActionCreator,
    setDone: setIsPostDeletedCommentActionCreator,
    run: () => postApi.deleteComment(postId, commentId),
    showSuccess: false,
  });

export const asyncDeleteAllPosts = () =>
  createMutationThunk({
    setStart: setIsPostDeleteAllActionCreator,
    setDone: setIsPostDeletedAllActionCreator,
    run: () => postApi.deleteAllPosts(),
  });
