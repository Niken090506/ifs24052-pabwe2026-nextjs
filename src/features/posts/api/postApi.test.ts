import { describe, it, expect, vi, beforeEach } from "vitest";
import postApi from "./postApi";
import apiHelper from "@/helpers/apiHelper";

describe("postApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getPosts", () => {
    it("should fetch all posts without isMe filter", async () => {
      const mockPosts = [{ id: "p1", description: "Hello" }];
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { posts: mockPosts },
        }),
      } as any);

      const posts = await postApi.getPosts();
      expect(posts).toEqual(mockPosts);
    });

    it("should fetch posts with isMe filter", async () => {
      const mockPosts = [{ id: "p2", description: "My post" }];
      const fetchSpy = vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { posts: mockPosts },
        }),
      } as any);

      const posts = await postApi.getPosts(true);
      expect(posts).toEqual(mockPosts);
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining("is_me=1"),
        expect.any(Object)
      );
    });

    it("should return empty array if data.posts is missing", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      } as any);

      const posts = await postApi.getPosts();
      expect(posts).toEqual([]);
    });
  });

  describe("getPostById", () => {
    it("should return post object when found", async () => {
      const mockPost = { id: "p1", description: "Post detail" };
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: { post: mockPost },
        }),
      } as any);

      const post = await postApi.getPostById("p1");
      expect(post).toEqual(mockPost);
    });

    it("should return null when post is not in data", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          data: {},
        }),
      } as any);

      const post = await postApi.getPostById("p99");
      expect(post).toBeNull();
    });
  });

  describe("postPost", () => {
    it("should create new post and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Postingan berhasil dibuat",
        }),
      } as any);

      const msg = await postApi.postPost("New post content");
      expect(msg).toBe("Postingan berhasil dibuat");
    });
  });

  describe("putPost", () => {
    it("should update post and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Postingan diubah",
        }),
      } as any);

      const msg = await postApi.putPost("p1", "Updated content");
      expect(msg).toBe("Postingan diubah");
    });
  });

  describe("postPostCover", () => {
    it("should upload post cover with filename", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Cover diubah",
        }),
      } as any);

      const file = new File(["dummy"], "cover.png", { type: "image/png" });
      const msg = await postApi.postPostCover("p1", file);
      expect(msg).toBe("Cover diubah");
    });

    it("should upload post cover without filename using fallback", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Cover diubah",
        }),
      } as any);

      const file = new File(["dummy"], "", { type: "image/png" });
      const msg = await postApi.postPostCover("p1", file);
      expect(msg).toBe("Cover diubah");
    });
  });

  describe("deletePost", () => {
    it("should delete post and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Postingan dihapus",
        }),
      } as any);

      const msg = await postApi.deletePost("p1");
      expect(msg).toBe("Postingan dihapus");
    });
  });

  describe("postLike", () => {
    it("should toggle like and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Suka berhasil diproses",
        }),
      } as any);

      const msg = await postApi.postLike("p1");
      expect(msg).toBe("Suka berhasil diproses");
    });
  });

  describe("postComment", () => {
    it("should add comment and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Komentar ditambahkan",
        }),
      } as any);

      const msg = await postApi.postComment("p1", "Keren!");
      expect(msg).toBe("Komentar ditambahkan");
    });
  });

  describe("deleteComment", () => {
    it("should delete comment and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Komentar dihapus",
        }),
      } as any);

      const msg = await postApi.deleteComment("p1", "c1");
      expect(msg).toBe("Komentar dihapus");
    });
  });

  describe("deleteAllPosts", () => {
    it("should delete all posts and return message", async () => {
      vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
        json: async () => ({
          status: "success",
          message: "Semua postingan dihapus",
        }),
      } as any);

      const msg = await postApi.deleteAllPosts();
      expect(msg).toBe("Semua postingan dihapus");
    });
  });
});
