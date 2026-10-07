import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NavbarComponent from "./NavbarComponent";
import type { User } from "@/types";

describe("NavbarComponent", () => {
  const dummyProfile: User = {
    id: "u1",
    name: "John Doe",
    email: "john@delcom.org",
    photo: "https://example.com/photo.jpg",
  };

  it("should render branding and call onToggleSidebar when menu button clicked", () => {
    const handleToggle = vi.fn();
    render(
      <NavbarComponent
        profile={dummyProfile}
        isSidebarOpen={false}
        onToggleSidebar={handleToggle}
        onLogout={vi.fn()}
      />
    );

    expect(screen.getByText("Postingan")).toBeInTheDocument();
    const menuBtn = screen.getByRole("button", { name: "Buka menu navigasi" });
    fireEvent.click(menuBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it("should open profile dropdown, show user email and handle logout", () => {
    const handleLogout = vi.fn();
    render(
      <NavbarComponent
        profile={dummyProfile}
        isSidebarOpen={false}
        onToggleSidebar={vi.fn()}
        onLogout={handleLogout}
      />
    );

    const profileDropdownBtn = screen.getByRole("button", { name: /John Doe/ });
    fireEvent.click(profileDropdownBtn);

    expect(screen.getByText("john@delcom.org")).toBeInTheDocument();
    expect(screen.getByText("Profil saya")).toBeInTheDocument();

    const logoutBtn = screen.getByRole("button", { name: "Keluar" });
    fireEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalled();
  });

  it("should close dropdown on outside click or Escape key", () => {
    render(
      <div>
        <NavbarComponent
          profile={dummyProfile}
          isSidebarOpen={false}
          onToggleSidebar={vi.fn()}
          onLogout={vi.fn()}
        />
        <div data-testid="outside-area">Outside</div>
      </div>
    );

    const profileDropdownBtn = screen.getByRole("button", { name: /John Doe/ });
    fireEvent.click(profileDropdownBtn);
    expect(screen.getByText("Profil saya")).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId("outside-area"));
    expect(screen.queryByText("Profil saya")).not.toBeInTheDocument();

    // Reopen and press Escape
    fireEvent.click(profileDropdownBtn);
    expect(screen.getByText("Profil saya")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("Profil saya")).not.toBeInTheDocument();

    // Reopen and press non-Escape key (should stay open)
    fireEvent.click(profileDropdownBtn);
    expect(screen.getByText("Profil saya")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Enter" });
    expect(screen.getByText("Profil saya")).toBeInTheDocument();

    // Click inside wrapper (should stay open)
    fireEvent.mouseDown(profileDropdownBtn);
    expect(screen.getByText("Profil saya")).toBeInTheDocument();

    // Reopen and click link inside dropdown
    const profileLink = screen.getByText("Profil saya");
    fireEvent.click(profileLink);
    expect(screen.queryByText("Profil saya")).not.toBeInTheDocument();
  });

  it("should fallback to Pengguna when profile is null or has no email", () => {
    const { rerender } = render(
      <NavbarComponent
        profile={null}
        isSidebarOpen={false}
        onToggleSidebar={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    const dropdownBtn = screen.getByRole("button", { name: /Pengguna/ });
    fireEvent.click(dropdownBtn);
    expect(screen.getAllByText("Pengguna").length).toBeGreaterThan(0);

    const profileWithoutEmail: User = { id: "u2", name: "UserOnlyName" };
    rerender(
      <NavbarComponent
        profile={profileWithoutEmail}
        isSidebarOpen={false}
        onToggleSidebar={vi.fn()}
        onLogout={vi.fn()}
      />
    );

    expect(screen.getAllByText("UserOnlyName").length).toBeGreaterThan(0);

    const profileEmpty: any = { id: "u3" };
    rerender(
      <NavbarComponent
        profile={profileEmpty}
        isSidebarOpen={false}
        onToggleSidebar={vi.fn()}
        onLogout={vi.fn()}
      />
    );
    expect(screen.getAllByText("Pengguna").length).toBeGreaterThan(0);
  });
});
