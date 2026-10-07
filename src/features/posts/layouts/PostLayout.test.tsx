import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import PostLayout from "./PostLayout";
import { renderWithProviders } from "@/test-utils";
import * as useHasTokenModule from "@/hooks/useHasToken";
import * as userAction from "@/features/users/states/action";
import * as authAction from "@/features/auth/states/action";
import apiHelper from "@/helpers/apiHelper";
import { navigation } from "@/setupTests";

describe("PostLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show RouteFallback and redirect when user has no token", () => {
    vi.spyOn(useHasTokenModule, "default").mockReturnValue(false);

    renderWithProviders(
      <PostLayout>
        <div>Content</div>
      </PostLayout>
    );

    expect(screen.getByText("Memuat halaman…")).toBeInTheDocument();
    expect(navigation.replace).toHaveBeenCalledWith("/auth/login");
  });

  it("should fetch profile and render layout when user has token", async () => {
    vi.spyOn(useHasTokenModule, "default").mockReturnValue(true);
    const mockProfileThunk = vi.fn().mockResolvedValue(true);
    vi.spyOn(userAction, "asyncSetProfile").mockReturnValue(mockProfileThunk as any);

    renderWithProviders(
      <PostLayout>
        <div data-testid="layout-child">Child Content</div>
      </PostLayout>,
      {
        profile: { id: "u1", name: "User 1", email: "u1@delcom.org" },
      }
    );

    expect(screen.getByTestId("layout-child")).toBeInTheDocument();
    expect(screen.getByText("Postingan")).toBeInTheDocument();
    expect(userAction.asyncSetProfile).toHaveBeenCalled();
  });

  it("should clear token and redirect when profile fetch returns false", async () => {
    vi.spyOn(useHasTokenModule, "default").mockReturnValue(true);
    const mockProfileThunk = vi.fn().mockResolvedValue(false);
    vi.spyOn(userAction, "asyncSetProfile").mockReturnValue(mockProfileThunk as any);
    const putTokenSpy = vi.spyOn(apiHelper, "putAccessToken");

    renderWithProviders(
      <PostLayout>
        <div>Child</div>
      </PostLayout>
    );

    await waitFor(() => {
      expect(putTokenSpy).toHaveBeenCalledWith("");
      expect(navigation.replace).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("should handle logout and redirect to login", async () => {
    vi.spyOn(useHasTokenModule, "default").mockReturnValue(true);
    vi.spyOn(userAction, "asyncSetProfile").mockReturnValue((() => Promise.resolve(true)) as any);
    const mockLogoutThunk = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(authAction, "asyncSetIsAuthLogout").mockReturnValue(mockLogoutThunk as any);

    renderWithProviders(
      <PostLayout>
        <div>Child</div>
      </PostLayout>,
      {
        profile: { id: "u1", name: "User 1", email: "u1@delcom.org" },
      }
    );

    // Open profile dropdown
    const profileBtn = screen.getByRole("button", { name: /User 1/ });
    fireEvent.click(profileBtn);

    const logoutBtn = screen.getByRole("button", { name: "Keluar" });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(authAction.asyncSetIsAuthLogout).toHaveBeenCalled();
      expect(navigation.replace).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("should toggle sidebar open and close", () => {
    vi.spyOn(useHasTokenModule, "default").mockReturnValue(true);
    vi.spyOn(userAction, "asyncSetProfile").mockReturnValue((() => Promise.resolve(true)) as any);

    renderWithProviders(
      <PostLayout>
        <div>Child</div>
      </PostLayout>
    );

    const menuBtn = screen.getByRole("button", { name: "Buka menu navigasi" });
    fireEvent.click(menuBtn);

    // Close using close menu button inside sidebar
    const closeBtn = screen.getByRole("button", { name: "Tutup menu" });
    fireEvent.click(closeBtn);
  });
});
