import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import AddModal from "./AddModal";
import { renderWithProviders } from "@/test-utils";
import * as postAction from "../states/action";

describe("AddModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should show validation error when submitting empty description", () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    renderWithProviders(<AddModal onClose={handleClose} onSuccess={handleSuccess} />);

    const submitBtn = screen.getByRole("button", { name: "Kirim postingan" });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Deskripsi wajib diisi.")).toBeInTheDocument();
    expect(handleSuccess).not.toHaveBeenCalled();
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("should submit post, call onSuccess and onClose when successful", async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const mockThunk = vi.fn().mockResolvedValue(true);
    vi.spyOn(postAction, "asyncAddPost").mockReturnValue(mockThunk as any);

    renderWithProviders(<AddModal onClose={handleClose} onSuccess={handleSuccess} />);

    const input = screen.getByLabelText("Apa yang ingin kamu bagikan?");
    fireEvent.change(input, { target: { value: "Cerita baru hari ini" } });

    const submitBtn = screen.getByRole("button", { name: "Kirim postingan" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postAction.asyncAddPost).toHaveBeenCalledWith("Cerita baru hari ini");
      expect(handleSuccess).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("should not call onSuccess or onClose when asyncAddPost fails", async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const mockThunk = vi.fn().mockResolvedValue(false);
    vi.spyOn(postAction, "asyncAddPost").mockReturnValue(mockThunk as any);

    renderWithProviders(<AddModal onClose={handleClose} onSuccess={handleSuccess} />);

    const input = screen.getByLabelText("Apa yang ingin kamu bagikan?");
    fireEvent.change(input, { target: { value: "Cerita gagal" } });

    const submitBtn = screen.getByRole("button", { name: "Kirim postingan" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postAction.asyncAddPost).toHaveBeenCalledWith("Cerita gagal");
      expect(handleSuccess).not.toHaveBeenCalled();
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  it("should close modal when Batal button is clicked", () => {
    const handleClose = vi.fn();
    renderWithProviders(<AddModal onClose={handleClose} onSuccess={vi.fn()} />);

    const cancelBtn = screen.getByRole("button", { name: "Batal" });
    fireEvent.click(cancelBtn);

    expect(handleClose).toHaveBeenCalled();
  });

  it("should display loading state when isPostAdd is true", () => {
    renderWithProviders(<AddModal onClose={vi.fn()} onSuccess={vi.fn()} />, {
      isPostAdd: true,
    });

    const submitBtn = screen.getByRole("button", { name: "Mengirim…" });
    expect(submitBtn).toBeDisabled();
  });
});
