import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("should render image when photo is provided", () => {
    const { container } = render(
      <Avatar name="John Doe" photo="https://example.com/avatar.jpg" size="lg" className="custom-avatar" />
    );
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(img).toHaveAttribute("width", "96");
    expect(img).toHaveAttribute("height", "96");
    expect(img).toHaveClass("custom-avatar");
  });

  it("should render initials when photo is not provided", () => {
    render(<Avatar name="John Doe" size="sm" className="custom-span" />);
    const span = screen.getByText("JD");
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass("h-8 w-8 text-xs");
    expect(span).toHaveClass("custom-span");
  });

  it("should handle single word name", () => {
    render(<Avatar name="John" size="md" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("should handle three words name by taking first two initials", () => {
    render(<Avatar name="John Middle Doe" />);
    expect(screen.getByText("JM")).toBeInTheDocument();
  });

  it("should fallback to ? when name is undefined or empty", () => {
    const { rerender } = render(<Avatar name={null} />);
    expect(screen.getByText("?")).toBeInTheDocument();

    rerender(<Avatar name="" />);
    expect(screen.getByText("?")).toBeInTheDocument();

    rerender(<Avatar name="   " />);
    expect(screen.getByText("?")).toBeInTheDocument();

    rerender(<Avatar />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
