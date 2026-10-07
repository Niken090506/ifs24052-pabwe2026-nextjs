import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AuthLayout from "./AuthLayout";
import * as useHasTokenModule from "@/hooks/useHasToken";
import { navigation } from "@/setupTests";

describe("AuthLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render branding and children when user has no token", () => {
    vi.spyOn(useHasTokenModule, "default").mockReturnValue(false);

    render(
      <AuthLayout>
        <div data-testid="child-element">Child Content</div>
      </AuthLayout>
    );

    expect(screen.getByTestId("child-element")).toBeInTheDocument();
    expect(screen.getByText("Postingan")).toBeInTheDocument();
    expect(
      screen.getByText("Bagikan cerita, beri suka, dan mulai percakapan.")
    ).toBeInTheDocument();
    expect(navigation.replace).not.toHaveBeenCalled();
  });

  it("should redirect to / when user has token", () => {
    vi.spyOn(useHasTokenModule, "default").mockReturnValue(true);

    render(
      <AuthLayout>
        <div>Content</div>
      </AuthLayout>
    );

    expect(navigation.replace).toHaveBeenCalledWith("/");
  });
});
