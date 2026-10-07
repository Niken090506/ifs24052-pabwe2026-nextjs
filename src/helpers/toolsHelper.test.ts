import { describe, it, expect, vi, beforeEach } from "vitest";
import Swal from "sweetalert2";
import {
  showErrorDialog,
  showWarningDialog,
  showSuccessDialog,
  showConfirmDialog,
  formatDate,
} from "./toolsHelper";

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe("toolsHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call Swal.fire for showErrorDialog", async () => {
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);
    await showErrorDialog("Error message");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Terjadi Kesalahan",
        text: "Error message",
        icon: "error",
      })
    );
  });

  it("should call Swal.fire for showWarningDialog", async () => {
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);
    await showWarningDialog("Warning message");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Perhatian",
        text: "Warning message",
        icon: "warning",
      })
    );
  });

  it("should call Swal.fire for showSuccessDialog", async () => {
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);
    await showSuccessDialog("Success message");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Berhasil",
        text: "Success message",
        icon: "success",
      })
    );
  });

  it("should call Swal.fire for showConfirmDialog with default and custom confirmText", async () => {
    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: true } as any);
    const confirmed = await showConfirmDialog("Judul", "Apakah yakin?");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Judul",
        text: "Apakah yakin?",
        confirmButtonText: "Ya",
      })
    );
    expect(confirmed).toBe(true);

    vi.mocked(Swal.fire).mockResolvedValue({ isConfirmed: false } as any);
    const cancelled = await showConfirmDialog("Judul Hapus", "Yakin hapus?", "Hapus Sekarang");
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Judul Hapus",
        text: "Yakin hapus?",
        confirmButtonText: "Hapus Sekarang",
      })
    );
    expect(cancelled).toBe(false);
  });

  it("should format valid date and return '-' for invalid or empty dates", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    expect(formatDate("")).toBe("-");
    expect(formatDate("not-a-date")).toBe("-");

    const formatted = formatDate("2024-02-26T02:34:26.000000Z");
    expect(formatted).toBeTruthy();
    expect(formatted).not.toBe("-");
  });
});
