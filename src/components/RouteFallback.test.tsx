import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RouteFallback from "./RouteFallback";

describe("RouteFallback", () => {
  it("should render fallback loading message with status role", () => {
    render(<RouteFallback />);
    const el = screen.getByRole("status");
    expect(el).toHaveTextContent("Memuat halaman…");
    expect(el).toHaveAttribute("aria-live", "polite");
  });
});
