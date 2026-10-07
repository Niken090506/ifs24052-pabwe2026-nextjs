import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMutationThunk, createFlagReducer, flagActionCreator } from "./thunkHelper";
import * as toolsHelper from "./toolsHelper";

describe("thunkHelper", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("createMutationThunk", () => {
    it("should run successfully with setDone and showSuccess enabled", async () => {
      const dispatch = vi.fn();
      const setStart = vi.fn((val: boolean) => ({ type: "START", payload: val }));
      const setDone = vi.fn((val: boolean) => ({ type: "DONE", payload: val }));
      const run = vi.fn().mockResolvedValue("Operasi berhasil");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog").mockResolvedValue({} as any);

      const thunk = createMutationThunk({
        setStart,
        setDone,
        run,
        showSuccess: true,
      });

      const result = await thunk(dispatch);

      expect(result).toBe(true);
      expect(dispatch).toHaveBeenCalledWith({ type: "START", payload: true });
      expect(dispatch).toHaveBeenCalledWith({ type: "DONE", payload: false });
      expect(dispatch).toHaveBeenCalledWith({ type: "DONE", payload: true });
      expect(successSpy).toHaveBeenCalledWith("Operasi berhasil");
      expect(dispatch).toHaveBeenCalledWith({ type: "START", payload: false });
    });

    it("should run successfully without setDone and without showSuccess", async () => {
      const dispatch = vi.fn();
      const setStart = vi.fn((val: boolean) => ({ type: "START", payload: val }));
      const run = vi.fn().mockResolvedValue("No success dialog");
      const successSpy = vi.spyOn(toolsHelper, "showSuccessDialog");

      const thunk = createMutationThunk({
        setStart,
        run,
        showSuccess: false,
      });

      const result = await thunk(dispatch);

      expect(result).toBe(true);
      expect(successSpy).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith({ type: "START", payload: false });
    });

    it("should handle error when run throws", async () => {
      const dispatch = vi.fn();
      const setStart = vi.fn((val: boolean) => ({ type: "START", payload: val }));
      const setDone = vi.fn((val: boolean) => ({ type: "DONE", payload: val }));
      const run = vi.fn().mockRejectedValue(new Error("Gagal proses"));
      const errorSpy = vi.spyOn(toolsHelper, "showErrorDialog").mockResolvedValue({} as any);

      const thunk = createMutationThunk({
        setStart,
        setDone,
        run,
      });

      const result = await thunk(dispatch);

      expect(result).toBe(false);
      expect(errorSpy).toHaveBeenCalledWith("Gagal proses");
      expect(dispatch).toHaveBeenCalledWith({ type: "DONE", payload: false });
      expect(dispatch).toHaveBeenCalledWith({ type: "START", payload: false });
    });
  });

  describe("createFlagReducer", () => {
    it("should create reducer with default initial value false", () => {
      const reducer = createFlagReducer("TEST_FLAG");
      expect(reducer()).toBe(false);
      expect(reducer(false, { type: "TEST_FLAG", payload: true })).toBe(true);
      expect(reducer(true, { type: "OTHER_ACTION" })).toBe(true);
    });

    it("should create reducer with custom initial value", () => {
      const reducer = createFlagReducer("CUSTOM_FLAG", true);
      expect(reducer()).toBe(true);
    });
  });

  describe("flagActionCreator", () => {
    it("should create action creator returning correct action object", () => {
      const creator = flagActionCreator("MY_FLAG");
      expect(creator(true)).toEqual({ type: "MY_FLAG", payload: true });
      expect(creator(false)).toEqual({ type: "MY_FLAG", payload: false });
    });
  });
});
