import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import UsersPage from "./UsersPage";
import { renderWithProviders } from "@/test-utils";
import * as userAction from "../states/action";

describe("UsersPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockUsers = [
    {
      id: "1",
      name: "Abdullah",
      email: "abdullah@delcom.org",
      photo: "https://example.com/photo.jpg",
    },
    {
      id: "2",
      name: "Ubaid",
      email: "ubaid@delcom.org",
      photo: null,
    },
    {
      id: "3",
      name: "",
      email: "",
      photo: null,
    },
  ];

  it("should render users list and filter by name or email", async () => {
    vi.spyOn(userAction, "asyncSetUsers").mockReturnValue((() => Promise.resolve()) as any);

    renderWithProviders(<UsersPage />, {
      users: mockUsers,
    });

    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("3 pengguna ditemukan")).toBeInTheDocument();
    });

    expect(screen.getByText("Abdullah")).toBeInTheDocument();
    expect(screen.getByText("Ubaid")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("Ketik nama atau email");
    fireEvent.change(searchInput, { target: { value: "ubaid" } });

    expect(screen.getByText("1 pengguna ditemukan")).toBeInTheDocument();
    expect(screen.getByText("Ubaid")).toBeInTheDocument();
    expect(screen.queryByText("Abdullah")).not.toBeInTheDocument();
  });

  it("should show empty state when no users match search", async () => {
    vi.spyOn(userAction, "asyncSetUsers").mockReturnValue((() => Promise.resolve()) as any);

    renderWithProviders(<UsersPage />, {
      users: mockUsers,
    });

    await waitFor(() => {
      expect(screen.getByText("3 pengguna ditemukan")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Ketik nama atau email");
    fireEvent.change(searchInput, { target: { value: "tidak-ada-nama" } });

    expect(screen.getByText("Tidak ada pengguna yang cocok.")).toBeInTheDocument();
  });

  it("should show loading state while fetching users", () => {
    vi.spyOn(userAction, "asyncSetUsers").mockReturnValue((() => new Promise(() => {})) as any);

    renderWithProviders(<UsersPage />, {
      users: [],
    });

    expect(screen.getByText("Memuat pengguna…")).toBeInTheDocument();
  });

  it("should cleanup effect without setting state after unmount", async () => {
    let resolveLoad: () => void = () => {};
    const pendingPromise = new Promise<void>((resolve) => {
      resolveLoad = resolve;
    });
    vi.spyOn(userAction, "asyncSetUsers").mockReturnValue((() => pendingPromise) as any);

    const { unmount } = renderWithProviders(<UsersPage />, {
      users: [],
    });

    unmount();
    resolveLoad();
    await pendingPromise;
  });
});
