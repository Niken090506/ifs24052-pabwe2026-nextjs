import type { ApiResult } from "@/types";

/**
 * Membaca respons JSON dari API Delcom dan melempar Error
 * apabila API melaporkan kegagalan.
 */
export async function parseResponse<T = unknown>(
  response: Response,
  fallbackMessage: string
): Promise<ApiResult<T>> {
  const result: ApiResult<T> = await response.json();
  if (result.status !== "success" && !result.success) {
    throw new Error(result.message || fallbackMessage);
  }
  return result;
}
