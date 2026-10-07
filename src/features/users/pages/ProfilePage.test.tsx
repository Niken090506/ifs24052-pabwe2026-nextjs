import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "./ProfilePage";
import { renderWithProviders } from "@/test-utils";
import * as toolsHelper from "@/helpers/toolsHelper";
import * as userAction from "../states/action";

describe("ProfilePage", () => {
  const mockProfile = {
    id: "1",
    name: "Abdullah Ubaid",
    email: "ifs18005@del.ac.id",
    photo: "https://example.com/photo.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render page headings and sections with profile data", () => {
    renderWithProviders(<ProfilePage />, {
      profile: mockProfile,
    });

    expect(screen.getByText("Profil Saya")).toBeInTheDocument();
    expect(screen.getByText("Informasi akun")).toBeInTheDocument();
    expect(screen.getByText("Foto profil")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ubah kata sandi" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Abdullah Ubaid")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ifs18005@del.ac.id")).toBeInTheDocument();
  });

  describe("InfoSection", () => {
    it("should show validation errors when name is empty or email is invalid", () => {
      const dispatchSpy = vi.spyOn(userAction, "asyncChangeProfile");

      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
      });

      const nameInput = screen.getByLabelText("Nama lengkap");
      const emailInput = screen.getByLabelText("Email");
      const submitBtn = screen.getByRole("button", { name: "Simpan perubahan" });

      fireEvent.change(nameInput, { target: { value: "" } });
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.click(submitBtn);

      expect(screen.getByText("Nama wajib diisi.")).toBeInTheDocument();
      expect(screen.getByText("Format email tidak valid.")).toBeInTheDocument();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should submit updated profile when info is valid", async () => {
      const mockThunk = vi.fn().mockResolvedValue(true);
      vi.spyOn(userAction, "asyncChangeProfile").mockReturnValue(mockThunk as any);

      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
      });

      const nameInput = screen.getByLabelText("Nama lengkap");
      const submitBtn = screen.getByRole("button", { name: "Simpan perubahan" });

      fireEvent.change(nameInput, { target: { value: "Updated Name" } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(userAction.asyncChangeProfile).toHaveBeenCalledWith(
          "Updated Name",
          "ifs18005@del.ac.id"
        );
      });
    });

    it("should display loading state when isChangeProfile is true", () => {
      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
        isChangeProfile: true,
      });

      expect(screen.getByRole("button", { name: "Menyimpan…" })).toBeDisabled();
    });
  });

  describe("PhotoSection", () => {
    it("should warn if user submits photo without choosing a file", async () => {
      const warnSpy = vi.spyOn(toolsHelper, "showWarningDialog").mockResolvedValue({} as any);

      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
      });

      const uploadBtn = screen.getByRole("button", { name: "Unggah foto" });
      fireEvent.click(uploadBtn);

      expect(warnSpy).toHaveBeenCalledWith("Pilih foto terlebih dahulu.");
    });

    it("should handle selecting no file (clearing file)", () => {
      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
      });

      const fileInput = screen.getByLabelText("Pilih foto baru");
      fireEvent.change(fileInput, { target: { files: [] } });
    });

    it("should warn if selected file is not an image", async () => {
      const warnSpy = vi.spyOn(toolsHelper, "showWarningDialog").mockResolvedValue({} as any);

      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
      });

      const fileInput = screen.getByLabelText("Pilih foto baru");
      const txtFile = new File(["dummy"], "file.txt", { type: "text/plain" });

      fireEvent.change(fileInput, { target: { files: [txtFile] } });

      expect(warnSpy).toHaveBeenCalledWith("Berkas harus berupa gambar.");
    });

    it("should warn if selected file exceeds 2MB", async () => {
      const warnSpy = vi.spyOn(toolsHelper, "showWarningDialog").mockResolvedValue({} as any);

      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
      });

      const fileInput = screen.getByLabelText("Pilih foto baru");
      const largeFile = new File([new Uint8Array(3 * 1024 * 1024)], "large.png", {
        type: "image/png",
      });

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      expect(warnSpy).toHaveBeenCalledWith("Ukuran foto maksimal 2 MB.");
    });

    it("should upload photo when a valid file is selected and submit is clicked", async () => {
      const mockThunk = vi.fn().mockResolvedValue(true);
      vi.spyOn(userAction, "asyncChangeProfilePhoto").mockReturnValue(mockThunk as any);

      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
      });

      const fileInput = screen.getByLabelText("Pilih foto baru");
      const validFile = new File(["img data"], "photo.png", { type: "image/png" });

      fireEvent.change(fileInput, { target: { files: [validFile] } });

      const uploadBtn = screen.getByRole("button", { name: "Unggah foto" });
      fireEvent.click(uploadBtn);

      await waitFor(() => {
        expect(userAction.asyncChangeProfilePhoto).toHaveBeenCalledWith(validFile);
      });
    });

    it("should not clear file when photo upload returns false", async () => {
      const mockThunk = vi.fn().mockResolvedValue(false);
      vi.spyOn(userAction, "asyncChangeProfilePhoto").mockReturnValue(mockThunk as any);

      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
      });

      const fileInput = screen.getByLabelText("Pilih foto baru");
      const validFile = new File(["img data"], "photo.png", { type: "image/png" });

      fireEvent.change(fileInput, { target: { files: [validFile] } });

      const uploadBtn = screen.getByRole("button", { name: "Unggah foto" });
      fireEvent.click(uploadBtn);

      await waitFor(() => {
        expect(userAction.asyncChangeProfilePhoto).toHaveBeenCalledWith(validFile);
      });
    });

    it("should display loading state when isChangeProfilePhoto is true", () => {
      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
        isChangeProfilePhoto: true,
      });

      expect(screen.getByRole("button", { name: "Mengunggah…" })).toBeDisabled();
    });
  });

  describe("PasswordSection", () => {
    it("should show validation errors for invalid password fields", () => {
      const dispatchSpy = vi.spyOn(userAction, "asyncChangeProfilePassword");

      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
      });

      const submitBtn = screen.getByRole("button", { name: "Ubah kata sandi" });
      fireEvent.click(submitBtn);

      expect(screen.getByText("Kata sandi saat ini wajib diisi.")).toBeInTheDocument();
      expect(screen.getByText("Kata sandi baru minimal 6 karakter.")).toBeInTheDocument();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should show error when confirm password does not match", () => {
      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
      });

      const currentInput = screen.getByLabelText("Kata sandi saat ini");
      const newInput = screen.getByLabelText("Kata sandi baru");
      const confirmInput = screen.getByLabelText("Konfirmasi kata sandi baru");
      const submitBtn = screen.getByRole("button", { name: "Ubah kata sandi" });

      fireEvent.change(currentInput, { target: { value: "oldsecret" } });
      fireEvent.change(newInput, { target: { value: "newsecret" } });
      fireEvent.change(confirmInput, { target: { value: "mismatch" } });
      fireEvent.click(submitBtn);

      expect(screen.getByText("Konfirmasi kata sandi tidak sama.")).toBeInTheDocument();
    });

    it("should submit password update and reset inputs when successful", async () => {
      const mockThunk = vi.fn().mockResolvedValue(true);
      vi.spyOn(userAction, "asyncChangeProfilePassword").mockReturnValue(mockThunk as any);

      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
      });

      const currentInput = screen.getByLabelText("Kata sandi saat ini");
      const newInput = screen.getByLabelText("Kata sandi baru");
      const confirmInput = screen.getByLabelText("Konfirmasi kata sandi baru");
      const submitBtn = screen.getByRole("button", { name: "Ubah kata sandi" });

      fireEvent.change(currentInput, { target: { value: "oldsecret" } });
      fireEvent.change(newInput, { target: { value: "newsecret" } });
      fireEvent.change(confirmInput, { target: { value: "newsecret" } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(userAction.asyncChangeProfilePassword).toHaveBeenCalledWith("oldsecret", "newsecret");
      });

      expect(currentInput).toHaveValue("");
      expect(newInput).toHaveValue("");
      expect(confirmInput).toHaveValue("");
    });

    it("should keep password inputs when update fails (returns false)", async () => {
      const mockThunk = vi.fn().mockResolvedValue(false);
      vi.spyOn(userAction, "asyncChangeProfilePassword").mockReturnValue(mockThunk as any);

      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
      });

      const currentInput = screen.getByLabelText("Kata sandi saat ini");
      const newInput = screen.getByLabelText("Kata sandi baru");
      const confirmInput = screen.getByLabelText("Konfirmasi kata sandi baru");
      const submitBtn = screen.getByRole("button", { name: "Ubah kata sandi" });

      fireEvent.change(currentInput, { target: { value: "oldsecret" } });
      fireEvent.change(newInput, { target: { value: "newsecret" } });
      fireEvent.change(confirmInput, { target: { value: "newsecret" } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(userAction.asyncChangeProfilePassword).toHaveBeenCalledWith("oldsecret", "newsecret");
      });

      expect(currentInput).toHaveValue("oldsecret");
    });

    it("should display loading state when isChangeProfilePassword is true", () => {
      renderWithProviders(<ProfilePage />, {
        profile: mockProfile,
        isChangeProfilePassword: true,
      });

      const submitBtn = screen.getAllByRole("button", { name: "Menyimpan…" })[0];
      expect(submitBtn).toBeDisabled();
    });
  });

  it("should handle null profile gracefully", () => {
    renderWithProviders(<ProfilePage />, {
      profile: null,
    });

    expect(screen.getByText("Profil Saya")).toBeInTheDocument();
  });
});
