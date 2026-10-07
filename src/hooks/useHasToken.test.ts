import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import React from "react";
import useHasToken from "./useHasToken";
import apiHelper from "@/helpers/apiHelper";

describe("useHasToken", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return false when access token is not present", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue(null);
    const { result } = renderHook(() => useHasToken());
    expect(result.current).toBe(false);
  });

  it("should return true when access token is present", () => {
    vi.spyOn(apiHelper, "getAccessToken").mockReturnValue("valid-token");
    const { result } = renderHook(() => useHasToken());
    expect(result.current).toBe(true);
  });

  it("should update when storage event fires and token changes", () => {
    let token: string | null = null;
    vi.spyOn(apiHelper, "getAccessToken").mockImplementation(() => token);

    const { result } = renderHook(() => useHasToken());
    expect(result.current).toBe(false);

    act(() => {
      token = "new-token";
      window.dispatchEvent(new Event("storage"));
    });

    expect(result.current).toBe(true);
  });

  it("should return false on server snapshot (SSR)", () => {
    function TestComponent() {
      const hasToken = useHasToken();
      return React.createElement("div", null, hasToken ? "yes" : "no");
    }

    const html = renderToString(React.createElement(TestComponent));
    expect(html).toContain("no");
  });
});
