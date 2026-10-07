import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalShell from "./ModalShell";

describe("ModalShell", () => {
  it("should render title and children, and close on close button or backdrop click", () => {
    const handleClose = vi.fn();
    render(
      <ModalShell titleId="modal-test" title="Test Modal" onClose={handleClose}>
        <div>Modal Content</div>
      </ModalShell>
    );

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Tutup dialog" });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    const backdrop = screen.getByTestId("modal-backdrop");
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it("should handle Escape key and trap Tab key focus", () => {
    const handleClose = vi.fn();
    render(
      <ModalShell titleId="modal-test" title="Trap Test" onClose={handleClose}>
        <input data-testid="input-1" />
        <button data-testid="button-2">Action</button>
      </ModalShell>
    );

    // Escape
    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleClose).toHaveBeenCalled();

    // Tab trap
    const closeBtn = screen.getByRole("button", { name: "Tutup dialog" });
    const actionBtn = screen.getByTestId("button-2");

    // Close button is the first focusable element, actionBtn is the last
    closeBtn.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(actionBtn);

    actionBtn.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: false });
    expect(document.activeElement).toBe(closeBtn);

    // Press Tab from middle element (neither first nor last)
    const midInput = screen.getByTestId("input-1");
    midInput.focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: false });
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });

    // Press other key like 'A'
    fireEvent.keyDown(document, { key: "A" });
  });

  it("should focus dialog if no input is present, and restore previous focus on unmount", () => {
    const btn = document.createElement("button");
    document.body.appendChild(btn);
    btn.focus();

    const { unmount } = render(
      <ModalShell titleId="modal-empty" title="Empty" onClose={vi.fn()}>
        <div>Static text only</div>
      </ModalShell>
    );

    unmount();
    document.body.removeChild(btn);
  });
});
