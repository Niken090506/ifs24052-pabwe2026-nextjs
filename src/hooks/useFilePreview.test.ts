import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useFilePreview from "./useFilePreview";

describe("useFilePreview", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    global.URL.createObjectURL = vi.fn((file: File) => `blob:mock-url-${file.name}`);
    global.URL.revokeObjectURL = vi.fn();
  });

  it("should initialize with null file and empty url", () => {
    const { result } = renderHook(() => useFilePreview());
    expect(result.current.file).toBeNull();
    expect(result.current.url).toBe("");
  });

  it("should create object url when file is set and revoke previous when replaced", () => {
    const { result } = renderHook(() => useFilePreview());
    const file1 = new File(["1"], "file1.png", { type: "image/png" });
    const file2 = new File(["2"], "file2.png", { type: "image/png" });

    act(() => {
      result.current.setFile(file1);
    });

    expect(result.current.file).toBe(file1);
    expect(result.current.url).toBe("blob:mock-url-file1.png");
    expect(URL.createObjectURL).toHaveBeenCalledWith(file1);

    act(() => {
      result.current.setFile(file2);
    });

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url-file1.png");
    expect(result.current.file).toBe(file2);
    expect(result.current.url).toBe("blob:mock-url-file2.png");
  });

  it("should set empty url and revoke previous when file is set to null", () => {
    const { result } = renderHook(() => useFilePreview());
    const file = new File(["test"], "test.png", { type: "image/png" });

    act(() => {
      result.current.setFile(file);
    });

    act(() => {
      result.current.setFile(null);
    });

    expect(result.current.file).toBeNull();
    expect(result.current.url).toBe("");
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url-test.png");
  });

  it("should revoke url on unmount when a file is set", () => {
    const { result, unmount } = renderHook(() => useFilePreview());
    const file = new File(["test"], "test.png", { type: "image/png" });

    act(() => {
      result.current.setFile(file);
    });

    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url-test.png");
  });

  it("should not revoke url on unmount when no file was set", () => {
    const { unmount } = renderHook(() => useFilePreview());
    unmount();
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
  });
});
