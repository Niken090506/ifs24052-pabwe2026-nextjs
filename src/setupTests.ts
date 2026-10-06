import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Mock global next/navigation agar komponen dapat diuji tanpa router Next.js
export const navigation = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  pathname: "/",
  params: {} as Record<string, string>,
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: navigation.push,
    replace: navigation.replace,
    back: navigation.back,
  }),
  usePathname: () => navigation.pathname,
  useParams: () => navigation.params,
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
  navigation.push.mockReset();
  navigation.replace.mockReset();
  navigation.back.mockReset();
  navigation.pathname = "/";
  navigation.params = {};
});
