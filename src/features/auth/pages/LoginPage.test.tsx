import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage, { validateLogin } from "./LoginPage";
import { renderWithProviders } from "@/test-utils";
import * as authAction from "../states/action";
import { navigation } from "@/setupTests";

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateLogin", () => {
    it("should validate empty email and password", () => {
      const errors = validateLogin("", "");
      expect(errors.email).toBe("Email wajib diisi.");
      expect(errors.password).toBe("Kata sandi wajib diisi.");
    });

    it("should validate invalid email format", () => {
      const errors = validateLogin("invalid-email", "password123");
      expect(errors.email).toBe("Format email tidak valid.");
      expect(errors.password).toBeUndefined();
    });

    it("should pass validation with valid email and password", () => {
      const errors = validateLogin("valid@example.com", "password123");
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  it("should redirect to / when isAuthLogin is true", () => {
    renderWithProviders(<LoginPage />, {
      isAuthLogin: true,
    });

    expect(navigation.replace).toHaveBeenCalledWith("/");
  });

  it("should show validation errors when submitting empty form", () => {
    const dispatchSpy = vi.spyOn(authAction, "asyncSetIsAuthLogin");

    renderWithProviders(<LoginPage />, {
      isAuthLogin: false,
    });

    const submitBtn = screen.getByRole("button", { name: "Masuk" });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Email wajib diisi.")).toBeInTheDocument();
    expect(screen.getByText("Kata sandi wajib diisi.")).toBeInTheDocument();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("should submit form when inputs are valid", async () => {
    const mockThunk = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(authAction, "asyncSetIsAuthLogin").mockReturnValue(mockThunk as any);

    renderWithProviders(<LoginPage />, {
      isAuthLogin: false,
    });

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Kata sandi");
    const submitBtn = screen.getByRole("button", { name: "Masuk" });

    fireEvent.change(emailInput, { target: { value: "user@delcom.org" } });
    fireEvent.change(passwordInput, { target: { value: "secret123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authAction.asyncSetIsAuthLogin).toHaveBeenCalledWith("user@delcom.org", "secret123");
    });
  });
});
