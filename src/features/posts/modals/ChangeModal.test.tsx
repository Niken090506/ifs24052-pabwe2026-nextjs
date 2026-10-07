import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import ChangeModal from "./ChangeModal";
import { renderWithProviders } from "@/test-utils";
import * as postAction from "../states/action";
import type { Post } from "@/types";

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const dummyPost: Post = {
    id: "p1",
    description: "Existing description",
  };

  it("should render with existing post description", () => {
    renderWithProviders(
      <ChangeModal post={dummyPost} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    const input = screen.getByLabelText("Deskripsi");
    expect(input).toHaveValue("Existing description");
  });

  it("should handle post with empty description fallback", () => {
    const emptyPost = { id: "p2", description: "" } as Post;
    renderWithProviders(
      <ChangeModal post={emptyPost} onClose={vi.fn()} onSuccess={vi.fn()} />
    );

    const input = screen.getByLabelText("Deskripsi");
    expect(input).toHaveValue("");
  });

  it("should show validation error when submitting empty description", () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    renderWithProviders(
      <ChangeModal post={dummyPost} onClose={handleClose} onSuccess={handleSuccess} />
    );

    const input = screen.getByLabelText("Deskripsi");
    fireEvent.change(input, { target: { value: "   " } });

    const submitBtn = screen.getByRole("button", { name: "Simpan perubahan" });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Deskripsi wajib diisi.")).toBeInTheDocument();
    expect(handleSuccess).not.toHaveBeenCalled();
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("should submit change, call onSuccess and onClose when successful", async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const mockThunk = vi.fn().mockResolvedValue(true);
    vi.spyOn(postAction, "asyncChangePost").mockReturnValue(mockThunk as any);

    renderWithProviders(
      <ChangeModal post={dummyPost} onClose={handleClose} onSuccess={handleSuccess} />
    );

    const input = screen.getByLabelText("Deskripsi");
    fireEvent.change(input, { target: { value: "Updated description" } });

    const submitBtn = screen.getByRole("button", { name: "Simpan perubahan" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postAction.asyncChangePost).toHaveBeenCalledWith("p1", "Updated description");
      expect(handleSuccess).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("should not call onSuccess or onClose when asyncChangePost fails", async () => {
    const handleClose = vi.fn();
    const handleSuccess = vi.fn();
    const mockThunk = vi.fn().mockResolvedValue(false);
    vi.spyOn(postAction, "asyncChangePost").mockReturnValue(mockThunk as any);

    renderWithProviders(
      <ChangeModal post={dummyPost} onClose={handleClose} onSuccess={handleSuccess} />
    );

    const submitBtn = screen.getByRole("button", { name: "Simpan perubahan" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(postAction.asyncChangePost).toHaveBeenCalledWith("p1", "Existing description");
      expect(handleSuccess).not.toHaveBeenCalled();
      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  it("should close modal when Batal button is clicked", () => {
    const handleClose = vi.fn();
    renderWithProviders(
      <ChangeModal post={dummyPost} onClose={handleClose} onSuccess={vi.fn()} />
    );

    const cancelBtn = screen.getByRole("button", { name: "Batal" });
    fireEvent.click(cancelBtn);

    expect(handleClose).toHaveBeenCalled();
  });

  it("should display loading state when isPostChange is true", () => {
    renderWithProviders(
      <ChangeModal post={dummyPost} onClose={vi.fn()} onSuccess={vi.fn()} />,
      {
        isPostChange: true,
      }
    );

    const submitBtn = screen.getByRole("button", { name: "Menyimpan…" });
    expect(submitBtn).toBeDisabled();
  });
});
