import { describe, it, expect } from "vitest";
import {
  getAuthor,
  getCommentsList,
  getLikesCount,
  getCommentsCount,
  isLikedBy,
  isOwnedBy,
  getCommentAuthorName,
  isCommentOwnedBy,
} from "./postHelper";
import type { Post, PostComment } from "@/types";

describe("postHelper", () => {
  describe("getAuthor", () => {
    it("should return post.user when available", () => {
      const post = { id: "1", description: "test", user: { id: "u1", name: "User 1" } } as Post;
      expect(getAuthor(post)).toEqual({ id: "u1", name: "User 1" });
    });

    it("should return post.author when post.user is not available", () => {
      const post = { id: "1", description: "test", author: { id: "a1", name: "Author 1" } } as Post;
      expect(getAuthor(post)).toEqual({ id: "a1", name: "Author 1" });
    });

    it("should fallback to post.user_id with default name", () => {
      const post = { id: "1", description: "test", user_id: "uid1" } as Post;
      expect(getAuthor(post)).toEqual({ id: "uid1", name: "Pengguna" });
    });

    it("should fallback to empty id with default name when no author info", () => {
      const post = { id: "1", description: "test" } as Post;
      expect(getAuthor(post)).toEqual({ id: "", name: "Pengguna" });
    });
  });

  describe("getCommentsList", () => {
    it("should return comments array when present", () => {
      const comments: PostComment[] = [{ id: "c1", comment: "nice" }];
      const post = { id: "1", description: "test", comments } as Post;
      expect(getCommentsList(post)).toBe(comments);
    });

    it("should return empty array when comments is not an array", () => {
      const post = { id: "1", description: "test", comments: 5 } as any;
      expect(getCommentsList(post)).toEqual([]);
    });
  });

  describe("getLikesCount", () => {
    it("should return total_likes if it is a number", () => {
      const post = { id: "1", description: "test", total_likes: 10 } as Post;
      expect(getLikesCount(post)).toBe(10);
    });

    it("should return length of likes array if total_likes is missing", () => {
      const post = { id: "1", description: "test", likes: [{}, {}] } as Post;
      expect(getLikesCount(post)).toBe(2);
    });

    it("should return likes if it is a number and total_likes is missing", () => {
      const post = { id: "1", description: "test", likes: 7 } as any;
      expect(getLikesCount(post)).toBe(7);
    });

    it("should return 0 when no likes data is available", () => {
      const post = { id: "1", description: "test" } as Post;
      expect(getLikesCount(post)).toBe(0);
    });
  });

  describe("getCommentsCount", () => {
    it("should return total_comments if it is a number", () => {
      const post = { id: "1", description: "test", total_comments: 8 } as Post;
      expect(getCommentsCount(post)).toBe(8);
    });

    it("should return length of comments array if total_comments is missing", () => {
      const post = { id: "1", description: "test", comments: [{ id: "c1", comment: "hi" }] } as Post;
      expect(getCommentsCount(post)).toBe(1);
    });

    it("should return comments if it is a number and total_comments is missing", () => {
      const post = { id: "1", description: "test", comments: 4 } as any;
      expect(getCommentsCount(post)).toBe(4);
    });

    it("should return 0 when no comments data is available", () => {
      const post = { id: "1", description: "test" } as Post;
      expect(getCommentsCount(post)).toBe(0);
    });
  });

  describe("isLikedBy", () => {
    it("should return false if owner is null or undefined", () => {
      const post = { id: "1", description: "test", likes: [{ user_id: "u1" }] } as Post;
      expect(isLikedBy(post, null)).toBe(false);
      expect(isLikedBy(post, undefined)).toBe(false);
    });

    it("should return false if post.likes is not an array", () => {
      const post = { id: "1", description: "test", likes: 5 } as any;
      expect(isLikedBy(post, { id: "u1" })).toBe(false);
    });

    it("should return true if post.likes contains item with matching user_id or id", () => {
      const post1 = { id: "1", description: "test", likes: [{ user_id: "u1" }] } as any;
      expect(isLikedBy(post1, { id: "u1" })).toBe(true);

      const post2 = { id: "1", description: "test", likes: [{ id: "u2" }] } as any;
      expect(isLikedBy(post2, { id: "u2" })).toBe(true);
    });

    it("should return false if no like matches or item is null", () => {
      const post = { id: "1", description: "test", likes: [null, { user_id: "other" }] } as any;
      expect(isLikedBy(post, { id: "u1" })).toBe(false);
    });
  });

  describe("isOwnedBy", () => {
    it("should return true if ownerId cannot be determined (undefined, null, or empty)", () => {
      const post1 = { id: "1", description: "test" } as Post;
      expect(isOwnedBy(post1, { id: "u1" })).toBe(true);

      const post2 = { id: "1", description: "test", user_id: "" } as Post;
      expect(isOwnedBy(post2, { id: "u1" })).toBe(true);
    });

    it("should check post.user_id against owner", () => {
      const post = { id: "1", description: "test", user_id: "u1" } as Post;
      expect(isOwnedBy(post, { id: "u1" })).toBe(true);
      expect(isOwnedBy(post, { id: "u2" })).toBe(false);
    });

    it("should check post.user.id against owner", () => {
      const post = { id: "1", description: "test", user: { id: "u1", name: "User" } } as Post;
      expect(isOwnedBy(post, { id: "u1" })).toBe(true);
      expect(isOwnedBy(post, { id: "u2" })).toBe(false);
    });

    it("should check post.author.id against owner", () => {
      const post = { id: "1", description: "test", author: { id: "a1", name: "Author" } } as Post;
      expect(isOwnedBy(post, { id: "a1" })).toBe(true);
      expect(isOwnedBy(post, { id: "a2" })).toBe(false);
    });
  });

  describe("getCommentAuthorName", () => {
    it("should return comment.user.name when present", () => {
      const comment: PostComment = { id: "c1", comment: "test", user: { id: "u1", name: "Author Name" } };
      expect(getCommentAuthorName(comment)).toBe("Author Name");
    });

    it("should return comment.name when comment.user is not present", () => {
      const comment: PostComment = { id: "c1", comment: "test", name: "Commenter" };
      expect(getCommentAuthorName(comment)).toBe("Commenter");
    });

    it("should return fallback 'Pengguna' when both are missing", () => {
      const comment: PostComment = { id: "c1", comment: "test" };
      expect(getCommentAuthorName(comment)).toBe("Pengguna");
    });
  });

  describe("isCommentOwnedBy", () => {
    it("should return true when ownerId cannot be determined (undefined or empty)", () => {
      const comment: PostComment = { id: "c1", comment: "test" };
      expect(isCommentOwnedBy(comment, { id: "u1" })).toBe(true);
    });

    it("should check comment.user_id against owner", () => {
      const comment: PostComment = { id: "c1", comment: "test", user_id: "u1" };
      expect(isCommentOwnedBy(comment, { id: "u1" })).toBe(true);
      expect(isCommentOwnedBy(comment, { id: "u2" })).toBe(false);
    });

    it("should check comment.user.id against owner", () => {
      const comment: PostComment = { id: "c1", comment: "test", user: { id: "u1", name: "U" } };
      expect(isCommentOwnedBy(comment, { id: "u1" })).toBe(true);
      expect(isCommentOwnedBy(comment, { id: "u2" })).toBe(false);
    });
  });
});
