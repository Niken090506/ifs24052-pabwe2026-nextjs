import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import ChangeCoverModal from "./ChangeCoverModal";
import { renderWithProviders } from "@/test-utils";
import * as postAction from "../states/action";
import * as toolsHelper from "@/helpers/toolsHelper";
import type { Post } from "@/types";

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const dummyPostWithCover: Post = {
    id: "p1",
    description: "Post with cover",
    cover: "https://example.com/cover.jpg",
  };

  const dummyPostNoCover: Post = {
    id: "p2",
    description: "Post without cover",
    cover: null,
  };

  it("should render current cover image when available", () => {
    renderWithProviders(
      <ChangeCoverModal post={dummyPostWithCover} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    const img = screen.getByAltText("Gambar postingan saat ini");
    expect(img).toHaveAttribute("src", "https://example.com/cover.jpg");
  });

  it("should render empty state message when post has no cover", () => {
    renderWithProviders(
      <ChangeCoverModal post={dummyPostNoCover} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    expect(screen.getByText("Belum ada gambar.")).toBeInTheDocument();
  });

  it("should warn if user submits without selecting a file", async () => {
    const warnSpy = vi.spyOn(toolsHelper, "showWarningDialog").mockResolvedValue({} as any);

    renderWithProviders(
      <ChangeCoverModal post={dummyPostNoCover} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    const submitBtn = screen.getByRole("button", { name: "Unggah gambar" });
    fireEvent.click(submitBtn);

    expect(warnSpy).toHaveBeenCalledWith("Pilih gambar terlebih dahulu.");
  });

  it("should handle clearing file selection", () => {
    renderWithProviders(
      <ChangeCoverModal post={dummyPostNoCover} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    const fileInput = screen.getByLabelText("Pilih gambar");
    fireEvent.change(fileInput, { target: { files: [] } });
  });

  it("should warn if selected file is not an image", async () => {
    const warnSpy = vi.spyOn(toolsHelper, "showWarningDialog").mockResolvedValue({} as any);

    renderWithProviders(
      <ChangeCoverModal post={dummyPostNoCover} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    const fileInput = screen.getByLabelText("Pilih gambar");
    const txtFile = new File(["dummy"], "file.txt", { type: "text/plain" });
    fireEvent.change(fileInput, { target: { files: [txtFile] } });

    expect(warnSpy).toHaveBeenCalledWith("Berkas harus berupa gambar.");
  });

  it("should warn if selected file exceeds 2MB", async () => {
    const warnSpy = vi.spyOn(toolsHelper, "showWarningDialog").mockResolvedValue({} as any);

    renderWithProviders(
      <ChangeCoverModal post={dummyPostNoCover} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    const fileInput = screen.getByLabelText("Pilih gambar");
    const largeFile = new File([new Uint8Array(3 * 1024 * 1024)], "large.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    expect(warnSpy).toHaveBeenCalledWith("Ukuran gambar maksimal 2 MB.");
  });

  it("should upload file and call onSuccess/onClose when successful", async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const mockThunk = vi.fn().mockResolvedValue(true);
    vi.spyOn(postAction, "asyncChangePostCover").mockReturnValue(mockThunk as any);

    renderWithProviders(
      <ChangeCoverModal post={dummyPostNoCover} onClose={handleClose} onSuccess={handleSuccess} />
    );

    const fileInput = screen.getByLabelText("Pilih gambar");
    const validFile = new File(["img"], "preview.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    const submitBtn = screen.getByRole("button", { name: "Unggah gambar" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postAction.asyncChangePostCover).toHaveBeenCalledWith("p2", validFile);
      expect(handleSuccess).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("should not call onSuccess/onClose when asyncChangePostCover returns false", async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const mockThunk = vi.fn().mockResolvedValue(false);
    vi.spyOn(postAction, "asyncChangePostCover").mockReturnValue(mockThunk as any);

    renderWithProviders(
      <ChangeCoverModal post={dummyPostNoCover} onClose={handleClose} onSuccess={handleSuccess} />
    );

    const fileInput = screen.getByLabelText("Pilih gambar");
    const validFile = new File(["img"], "preview.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [validFile] } });

    const submitBtn = screen.getByRole("button", { name: "Unggah gambar" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postAction.asyncChangePostCover).toHaveBeenCalledWith("p2", validFile);
      expect(handleSuccess).not.toHaveBeenCalled();
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  it("should close modal when Batal button is clicked", () => {
    const handleClose = vi.fn();
    renderWithProviders(
      <ChangeCoverModal post={dummyPostNoCover} onClose={handleClose} onSuccess={vi.fn()} />
    );

    const cancelBtn = screen.getByRole("button", { name: "Batal" });
    fireEvent.click(cancelBtn);

    expect(handleClose).toHaveBeenCalled();
  });

  it("should display loading state when isPostChangeCover is true", () => {
    renderWithProviders(
      <ChangeCoverModal post={dummyPostNoCover} onClose={vi.fn()} onSuccess={vi.fn()} />,
      {
        isPostChangeCover: true,
      }
    );

    const submitBtn = screen.getByRole("button", { name: "Mengunggah…" });
    expect(submitBtn).toBeDisabled();
  });
});
