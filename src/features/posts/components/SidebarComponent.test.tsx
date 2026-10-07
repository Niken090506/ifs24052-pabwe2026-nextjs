import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SidebarComponent from "./SidebarComponent";
import { navigation } from "@/setupTests";

describe("SidebarComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all menu items and mark active item for root path", () => {
    navigation.pathname = "/";
    render(<SidebarComponent isOpen={false} onClose={vi.fn()} />);

    expect(screen.getByText("Semua Postingan")).toBeInTheDocument();
    expect(screen.getByText("Postingan Saya")).toBeInTheDocument();
    expect(screen.getByText("Daftar Pengguna")).toBeInTheDocument();
    expect(screen.getByText("Profil Saya")).toBeInTheDocument();

    const homeLink = screen.getByText("Semua Postingan");
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("should mark Semua Postingan active for /posts/[id] path", () => {
    navigation.pathname = "/posts/p123";
    render(<SidebarComponent isOpen={false} onClose={vi.fn()} />);

    const homeLink = screen.getByText("Semua Postingan");
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("should mark respective items active for /saya, /users, and /profile", () => {
    navigation.pathname = "/saya";
    const { rerender } = render(<SidebarComponent isOpen={false} onClose={vi.fn()} />);
    expect(screen.getByText("Postingan Saya")).toHaveAttribute("aria-current", "page");

    navigation.pathname = "/users";
    rerender(<SidebarComponent isOpen={false} onClose={vi.fn()} />);
    expect(screen.getByText("Daftar Pengguna")).toHaveAttribute("aria-current", "page");

    navigation.pathname = "/profile";
    rerender(<SidebarComponent isOpen={false} onClose={vi.fn()} />);
    expect(screen.getByText("Profil Saya")).toHaveAttribute("aria-current", "page");
  });

  it("should handle isOpen true, close on backdrop, close button, or link click", () => {
    const handleClose = vi.fn();
    render(<SidebarComponent isOpen={true} onClose={handleClose} />);

    // Backdrop click
    const backdrop = screen.getByLabelText("Tutup menu navigasi");
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Close button click
    const closeBtn = screen.getByRole("button", { name: "Tutup menu" });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);

    // Link click
    const link = screen.getByText("Daftar Pengguna");
    fireEvent.click(link);
    expect(handleClose).toHaveBeenCalledTimes(3);
  });
});
