import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import DetailPage from "./DetailPage";
import { renderWithProviders } from "@/test-utils";
import * as postAction from "../states/action";
import * as toolsHelper from "@/helpers/toolsHelper";
import { navigation } from "@/setupTests";
import type { Post } from "@/types";

describe("DetailPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    navigation.params = { postId: "p1" };
    vi.spyOn(postAction, "asyncSetPost").mockImplementation((() => () => Promise.resolve()) as any);
  });

  const dummyPost: Post = {
    id: "p1",
    description: "Detail postingan yang sangat lengkap",
    cover: "https://example.com/cover.jpg",
    created_at: "2024-01-01T00:00:00.000Z",
    user_id: "u1",
    user: { id: "u1", name: "Alice", photo: "https://example.com/alice.jpg" },
    total_likes: 3,
    likes: [{ user_id: "u1" }],
    total_comments: 2,
    comments: [
      { id: "c1", comment: "Komentar saya sendiri", user_id: "u1", name: "Alice" },
      { id: "c2", comment: "Komentar pengguna lain", user_id: "u2", name: "Bob" },
    ],
  };

  it("should show loading state when loading and post is null", () => {
    renderWithProviders(<DetailPage />, {
      post: null,
      isPost: true,
    });

    expect(screen.getByText("Memuat detail postingan…")).toBeInTheDocument();
  });

  it("should show not found state when post is null and not loading", () => {
    renderWithProviders(<DetailPage />, {
      post: null,
      isPost: false,
    });

    expect(screen.getByText("Postingan tidak ditemukan")).toBeInTheDocument();
  });

  it("should render post details, author, cover, likes, and comments", () => {
    const { unmount } = renderWithProviders(<DetailPage />, {
      post: dummyPost,
      profile: { id: "u1", name: "Alice" },
      isPost: false,
    });

    expect(screen.getByText("Detail postingan yang sangat lengkap")).toBeInTheDocument();
    expect(screen.getByText("Postingan dari Alice")).toBeInTheDocument();
    expect(screen.getByAltText("Gambar postingan dari Alice")).toBeInTheDocument();
    expect(screen.getByText("3 suka")).toBeInTheDocument();
    expect(screen.getByText("2 komentar")).toBeInTheDocument();
    expect(screen.getByText("Komentar saya sendiri")).toBeInTheDocument();
    expect(screen.getByText("Komentar pengguna lain")).toBeInTheDocument();

    unmount();
  });

  it("should render post without cover and unliked by other user", () => {
    const postNoCover: Post = {
      ...dummyPost,
      cover: null,
      likes: [],
      total_likes: 0,
    };

    renderWithProviders(<DetailPage />, {
      post: postNoCover,
      profile: { id: "u2", name: "Bob" },
      isPost: false,
    });

    expect(screen.getByText("0 suka")).toBeInTheDocument();
    expect(screen.queryByAltText("Gambar postingan dari Alice")).not.toBeInTheDocument();
    // Non-owner should not see owner buttons
    expect(screen.queryByRole("button", { name: "Ubah postingan" })).not.toBeInTheDocument();
  });

  it("should handle like button click when success and failure", async () => {
    const mockLikeThunk = vi.fn().mockResolvedValue(true);
    vi.spyOn(postAction, "asyncLikePost").mockReturnValue(mockLikeThunk as any);
    const reloadSpy = postAction.asyncSetPost;

    renderWithProviders(<DetailPage />, {
      post: dummyPost,
      profile: { id: "u1", name: "Alice" },
      isPost: false,
    });

    const likeBtn = screen.getByRole("button", { name: /3 suka/ });
    fireEvent.click(likeBtn);

    await waitFor(() => {
      expect(postAction.asyncLikePost).toHaveBeenCalledWith("p1");
      expect(reloadSpy).toHaveBeenCalledWith("p1");
    });

    // Test failure case (ok = false)
    mockLikeThunk.mockResolvedValue(false);
    fireEvent.click(likeBtn);
    await waitFor(() => {
      expect(postAction.asyncLikePost).toHaveBeenCalledWith("p1");
    });
  });

  it("should handle owner actions: open cover modal, change modal, and delete post", async () => {
    const confirmSpy = vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);
    const mockDeleteThunk = vi.fn().mockResolvedValue(true);
    vi.spyOn(postAction, "asyncDeletePost").mockReturnValue(mockDeleteThunk as any);

    renderWithProviders(<DetailPage />, {
      post: dummyPost,
      profile: { id: "u1", name: "Alice" },
      isPost: false,
    });

    // Open change modal and test submit success
    const changeBtn = screen.getByRole("button", { name: "Ubah postingan" });
    fireEvent.click(changeBtn);
    expect(screen.getByText("Deskripsi")).toBeInTheDocument();

    const mockChangeThunk = vi.fn().mockResolvedValue(true);
    vi.spyOn(postAction, "asyncChangePost").mockReturnValue(mockChangeThunk as any);
    const saveChangeBtn = screen.getByRole("button", { name: "Simpan perubahan" });
    fireEvent.click(saveChangeBtn);
    await waitFor(() => {
      expect(postAction.asyncChangePost).toHaveBeenCalledWith("p1", dummyPost.description);
      expect(postAction.asyncSetPost).toHaveBeenCalledWith("p1");
    });

    // Open cover modal and test cancel
    const coverBtn = screen.getByRole("button", { name: "Ubah gambar" });
    fireEvent.click(coverBtn);
    expect(screen.getByText("Pilih gambar")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.queryByText("Pilih gambar")).not.toBeInTheDocument();

    // Open cover modal and test submit success
    fireEvent.click(coverBtn);
    const file = new File(["dummy content"], "photo.png", { type: "image/png" });
    const fileInput = screen.getByLabelText("Pilih gambar");
    fireEvent.change(fileInput, { target: { files: [file] } });
    const mockCoverThunk = vi.fn().mockResolvedValue(true);
    vi.spyOn(postAction, "asyncChangePostCover").mockReturnValue(mockCoverThunk as any);
    const saveCoverBtn = screen.getByRole("button", { name: "Unggah gambar" });
    fireEvent.click(saveCoverBtn);
    await waitFor(() => {
      expect(postAction.asyncChangePostCover).toHaveBeenCalledWith("p1", file);
    });

    // Delete post
    const deleteBtn = screen.getByRole("button", { name: "Hapus postingan" });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(postAction.asyncDeletePost).toHaveBeenCalledWith("p1");
      expect(navigation.replace).toHaveBeenCalledWith("/");
    });
  });

  it("should handle delete post when deletion returns false", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);
    const mockDeleteThunk = vi.fn().mockResolvedValue(false);
    vi.spyOn(postAction, "asyncDeletePost").mockReturnValue(mockDeleteThunk as any);

    renderWithProviders(<DetailPage />, {
      post: dummyPost,
      profile: { id: "u1", name: "Alice" },
      isPost: false,
    });

    const deleteBtn = screen.getByRole("button", { name: "Hapus postingan" });
    fireEvent.click(deleteBtn);

    await waitFor(() => {
      expect(postAction.asyncDeletePost).toHaveBeenCalledWith("p1");
      expect(navigation.replace).not.toHaveBeenCalled();
    });
  });

  it("should not delete post when user cancels confirmation", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(false);
    const deleteSpy = vi.spyOn(postAction, "asyncDeletePost");

    renderWithProviders(<DetailPage />, {
      post: dummyPost,
      profile: { id: "u1", name: "Alice" },
      isPost: false,
    });

    const deleteBtn = screen.getByRole("button", { name: "Hapus postingan" });
    fireEvent.click(deleteBtn);

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should handle comment submission validation, success, and failure", async () => {
    const mockCommentThunk = vi.fn().mockResolvedValue(true);
    vi.spyOn(postAction, "asyncAddComment").mockReturnValue(mockCommentThunk as any);

    renderWithProviders(<DetailPage />, {
      post: dummyPost,
      profile: { id: "u1", name: "Alice" },
      isPost: false,
    });

    const commentInput = screen.getByLabelText("Tulis komentar");
    const submitBtn = screen.getByRole("button", { name: "Kirim komentar" });

    // Empty comment error
    fireEvent.click(submitBtn);
    expect(screen.getByText("Komentar wajib diisi.")).toBeInTheDocument();

    // Valid comment success
    fireEvent.change(commentInput, { target: { value: "Komentar baru saya" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postAction.asyncAddComment).toHaveBeenCalledWith("p1", "Komentar baru saya");
      expect(postAction.asyncSetPost).toHaveBeenCalledWith("p1");
    });

    // Valid comment failure
    mockCommentThunk.mockResolvedValue(false);
    fireEvent.change(commentInput, { target: { value: "Komentar gagal" } });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(postAction.asyncAddComment).toHaveBeenCalledWith("p1", "Komentar gagal");
    });
  });

  it("should handle delete comment confirmation, cancellation, and failure", async () => {
    const confirmSpy = vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);
    const mockDeleteCommentThunk = vi.fn().mockResolvedValue(true);
    vi.spyOn(postAction, "asyncDeleteComment").mockReturnValue(mockDeleteCommentThunk as any);

    renderWithProviders(<DetailPage />, {
      post: dummyPost,
      profile: { id: "u1", name: "Alice" },
      isPost: false,
    });

    const deleteCommentBtn = screen.getByLabelText("Hapus komentar dari Alice");
    fireEvent.click(deleteCommentBtn);

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(postAction.asyncDeleteComment).toHaveBeenCalledWith("p1", "c1");
      expect(postAction.asyncSetPost).toHaveBeenCalledWith("p1");
    });

    // Test failure on delete comment
    mockDeleteCommentThunk.mockResolvedValue(false);
    fireEvent.click(deleteCommentBtn);
    await waitFor(() => {
      expect(postAction.asyncDeleteComment).toHaveBeenCalledWith("p1", "c1");
    });

    // Test cancel delete comment
    confirmSpy.mockResolvedValue(false);
    const mockDeleteCommentThunk2 = vi.fn();
    vi.spyOn(postAction, "asyncDeleteComment").mockReturnValue(mockDeleteCommentThunk2 as any);

    fireEvent.click(deleteCommentBtn);
    expect(mockDeleteCommentThunk2).not.toHaveBeenCalled();
  });

  it("should render empty comments message when post has no comments", () => {
    const postNoComments: Post = {
      ...dummyPost,
      comments: [],
    };

    renderWithProviders(<DetailPage />, {
      post: postNoComments,
      profile: { id: "u1", name: "Alice" },
      isPost: false,
    });

    expect(screen.getByText("Belum ada komentar.")).toBeInTheDocument();
  });

  it("should disable buttons when liking or commenting is in progress", () => {
    renderWithProviders(<DetailPage />, {
      post: dummyPost,
      profile: { id: "u1", name: "Alice" },
      isPost: false,
      isPostLike: true,
      isPostAddComment: true,
    });

    expect(screen.getByRole("button", { name: "Mengirim…" })).toBeDisabled();
    expect(screen.getByRole("button", { name: /3 suka/ })).toBeDisabled();
  });
});
