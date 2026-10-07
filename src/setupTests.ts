import "@testing-library/jest-dom/vitest";
import React from "react";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock global next/navigation agar komponen dapat diuji tanpa router Next.js
export const navigation = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(),
  pathname: "/",
  params: {} as Record<string, string>,
};

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) =>
    React.createElement("a", { href, ...props }, children),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: navigation.push,
    replace: navigation.replace,
    back: navigation.back,
    prefetch: navigation.prefetch,
  }),
  usePathname: () => navigation.pathname,
  useParams: () => navigation.params,
  useSearchParams: () => new URLSearchParams(),
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
  navigation.push.mockReset();
  navigation.replace.mockReset();
  navigation.back.mockReset();
  navigation.prefetch.mockReset();
  navigation.pathname = "/";
  navigation.params = {};
});
