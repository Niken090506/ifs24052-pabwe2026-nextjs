import { describe, it, expect } from "vitest";
import { parseResponse } from "./responseHelper";

describe("responseHelper", () => {
  it("should return result when status is success", async () => {
    const mockResponse = {
      json: async () => ({ status: "success", data: { id: 1 } }),
    } as Response;

    const result = await parseResponse(mockResponse, "Fallback");
    expect(result).toEqual({ status: "success", data: { id: 1 } });
  });

  it("should return result when success boolean is true", async () => {
    const mockResponse = {
      json: async () => ({ success: true, data: { count: 5 } }),
    } as Response;

    const result = await parseResponse(mockResponse, "Fallback");
    expect(result).toEqual({ success: true, data: { count: 5 } });
  });

  it("should throw error with message from api when failed", async () => {
    const mockResponse = {
      json: async () => ({ status: "fail", message: "API error message" }),
    } as Response;

    await expect(parseResponse(mockResponse, "Fallback")).rejects.toThrow("API error message");
  });

  it("should throw error with fallback message when api message is missing", async () => {
    const mockResponse = {
      json: async () => ({ status: "error" }),
    } as Response;

    await expect(parseResponse(mockResponse, "Default error")).rejects.toThrow("Default error");
  });
});
