import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";
import { renderWithProviders } from "@/test-utils";
import * as postAction from "../states/action";
import * as toolsHelper from "@/helpers/toolsHelper";
import type { Post } from "@/types";

describe("HomePage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(postAction, "asyncSetPosts").mockImplementation((() => () => Promise.resolve()) as any);
  });

  const dummyPosts: Post[] = [
    {
      id: "p1",
      description: "Postingan pertama saya di linimasa",
      cover: "https://example.com/cover1.jpg",
      created_at: "2024-01-01T00:00:00.000Z",
      user: { id: "u1", name: "Alice", photo: null },
      total_likes: 5,
      total_comments: 2,
    },
    {
      id: "p2",
      description: "Cerita kedua tanpa gambar",
      cover: null,
      created_at: "2024-01-02T00:00:00.000Z",
      user: { id: "u2", name: "Bob", photo: null },
      total_likes: 0,
      total_comments: 0,
    },
    {
      id: "p3",
      description: "",
      cover: null,
      created_at: "2024-01-03T00:00:00.000Z",
      user: { id: "u3", name: "Charlie", photo: null },
      total_likes: 0,
      total_comments: 0,
    },
  ];

  it("should render all mode, load posts, and display cards", () => {
    const dispatchSpy = postAction.asyncSetPosts;

    renderWithProviders(<HomePage mode="all" />, {
      posts: dummyPosts,
      isPost: false,
    });

    expect(screen.getByText("Semua Postingan")).toBeInTheDocument();
    expect(screen.getByText("Postingan pertama saya di linimasa")).toBeInTheDocument();
    expect(screen.getByText("Cerita kedua tanpa gambar")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("5 suka")).toBeInTheDocument();
    expect(screen.getByText("2 komentar")).toBeInTheDocument();
    expect(screen.getByText("3 postingan ditampilkan")).toBeInTheDocument();
    expect(dispatchSpy).toHaveBeenCalledWith(false);
  });

  it("should filter posts by description and author name", () => {
    renderWithProviders(<HomePage mode="all" />, {
      posts: dummyPosts,
      isPost: false,
    });

    const searchInput = screen.getByLabelText("Cari postingan");

    // Search by description
    fireEvent.change(searchInput, { target: { value: "tanpa gambar" } });
    expect(screen.getByText("Cerita kedua tanpa gambar")).toBeInTheDocument();
    expect(screen.queryByText("Postingan pertama saya di linimasa")).not.toBeInTheDocument();

    // Search by author name
    fireEvent.change(searchInput, { target: { value: "alice" } });
    expect(screen.getByText("Postingan pertama saya di linimasa")).toBeInTheDocument();
    expect(screen.queryByText("Cerita kedua tanpa gambar")).not.toBeInTheDocument();

    // Search no results
    fireEvent.change(searchInput, { target: { value: "tidak-ada-cocok" } });
    expect(screen.getByText("Belum ada postingan yang cocok.")).toBeInTheDocument();
  });

  it("should render me mode and handle delete all posts", async () => {
    const dispatchSpy = postAction.asyncSetPosts;
    const confirmSpy = vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);
    const mockDeleteAll = vi.fn().mockResolvedValue(true);
    vi.spyOn(postAction, "asyncDeleteAllPosts").mockReturnValue(mockDeleteAll as any);

    renderWithProviders(<HomePage mode="me" />, {
      posts: dummyPosts,
      isPost: false,
    });

    expect(screen.getByText("Postingan Saya")).toBeInTheDocument();
    expect(dispatchSpy).toHaveBeenCalledWith(true);

    const deleteAllBtn = screen.getByRole("button", { name: "Hapus semua postingan saya" });
    fireEvent.click(deleteAllBtn);

    await waitFor(() => {
      expect(confirmSpy).toHaveBeenCalled();
      expect(postAction.asyncDeleteAllPosts).toHaveBeenCalled();
    });
  });

  it("should handle delete all posts when deletion returns false", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(true);
    const mockDeleteAll = vi.fn().mockResolvedValue(false);
    vi.spyOn(postAction, "asyncDeleteAllPosts").mockReturnValue(mockDeleteAll as any);

    renderWithProviders(<HomePage mode="me" />, {
      posts: dummyPosts,
      isPost: false,
    });

    const deleteAllBtn = screen.getByRole("button", { name: "Hapus semua postingan saya" });
    fireEvent.click(deleteAllBtn);

    await waitFor(() => {
      expect(postAction.asyncDeleteAllPosts).toHaveBeenCalled();
    });
  });

  it("should cancel delete all when user cancels dialog", async () => {
    vi.spyOn(toolsHelper, "showConfirmDialog").mockResolvedValue(false);
    const deleteSpy = vi.spyOn(postAction, "asyncDeleteAllPosts");

    renderWithProviders(<HomePage mode="me" />, {
      posts: dummyPosts,
      isPost: false,
    });

    const deleteAllBtn = screen.getByRole("button", { name: "Hapus semua postingan saya" });
    fireEvent.click(deleteAllBtn);

    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it("should display loading indicator when isPost is true", () => {
    renderWithProviders(<HomePage mode="all" />, {
      posts: [],
      isPost: true,
    });

    expect(screen.getByText("Memuat postingan…")).toBeInTheDocument();
  });

  it("should open and close AddModal, and refresh posts on success", async () => {
    const refreshSpy = postAction.asyncSetPosts;

    renderWithProviders(<HomePage mode="all" />, {
      posts: dummyPosts,
      isPost: false,
    });

    const createBtn = screen.getByRole("button", { name: "Buat postingan" });
    fireEvent.click(createBtn);

    expect(screen.getByText("Apa yang ingin kamu bagikan?")).toBeInTheDocument();

    // Close modal
    const cancelBtn = screen.getByRole("button", { name: "Batal" });
    fireEvent.click(cancelBtn);
    expect(screen.queryByText("Apa yang ingin kamu bagikan?")).not.toBeInTheDocument();

    // Reopen and simulate success
    fireEvent.click(createBtn);
    const mockAddThunk = vi.fn().mockResolvedValue(true);
    vi.spyOn(postAction, "asyncAddPost").mockReturnValue(mockAddThunk as any);

    const descInput = screen.getByLabelText("Apa yang ingin kamu bagikan?");
    fireEvent.change(descInput, { target: { value: "Postingan sukses" } });

    const submitBtn = screen.getByRole("button", { name: "Kirim postingan" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(refreshSpy).toHaveBeenCalled();
    });
  });
});
