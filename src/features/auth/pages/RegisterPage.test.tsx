import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage, { validateRegister } from "./RegisterPage";
import { renderWithProviders } from "@/test-utils";
import * as authAction from "../states/action";
import { navigation } from "@/setupTests";

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validateRegister", () => {
    it("should return errors when fields are empty", () => {
      const errors = validateRegister("", "", "", "");
      expect(errors.name).toBe("Nama wajib diisi.");
      expect(errors.email).toBe("Email wajib diisi.");
      expect(errors.password).toBe("Kata sandi minimal 6 karakter.");
      expect(errors.confirmPassword).toBeUndefined();
    });

    it("should return format error when email is invalid", () => {
      const errors = validateRegister("John", "not-an-email", "123456", "123456");
      expect(errors.email).toBe("Format email tidak valid.");
      expect(errors.password).toBeUndefined();
    });

    it("should return error when confirm password does not match", () => {
      const errors = validateRegister("John", "john@delcom.org", "123456", "654321");
      expect(errors.confirmPassword).toBe("Konfirmasi kata sandi tidak sama.");
    });

    it("should return empty errors for valid input", () => {
      const errors = validateRegister("John", "john@delcom.org", "123456", "123456");
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });

  it("should redirect and reset isAuthRegister when isAuthRegister is true", () => {
    const setIsRegisterSpy = vi.spyOn(authAction, "setIsAuthRegisterActionCreator");

    renderWithProviders(<RegisterPage />, {
      isAuthRegister: true,
    });

    expect(setIsRegisterSpy).toHaveBeenCalledWith(false);
    expect(navigation.replace).toHaveBeenCalledWith("/auth/login");
  });

  it("should show validation errors when submitting empty form", () => {
    const dispatchSpy = vi.spyOn(authAction, "asyncSetIsAuthRegister");

    renderWithProviders(<RegisterPage />, {
      isAuthRegister: false,
    });

    const submitBtn = screen.getByRole("button", { name: "Daftar" });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Nama wajib diisi.")).toBeInTheDocument();
    expect(screen.getByText("Email wajib diisi.")).toBeInTheDocument();
    expect(screen.getByText("Kata sandi minimal 6 karakter.")).toBeInTheDocument();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("should submit form when inputs are valid", async () => {
    const mockThunk = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(authAction, "asyncSetIsAuthRegister").mockReturnValue(mockThunk as any);

    renderWithProviders(<RegisterPage />, {
      isAuthRegister: false,
    });

    const nameInput = screen.getByLabelText("Nama lengkap");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Kata sandi");
    const confirmInput = screen.getByLabelText("Konfirmasi kata sandi");
    const submitBtn = screen.getByRole("button", { name: "Daftar" });

    fireEvent.change(nameInput, { target: { value: "User Baru" } });
    fireEvent.change(emailInput, { target: { value: "userbaru@delcom.org" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "password123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authAction.asyncSetIsAuthRegister).toHaveBeenCalledWith(
        "User Baru",
        "userbaru@delcom.org",
        "password123"
      );
    });
  });
});
