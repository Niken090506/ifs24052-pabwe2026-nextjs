"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IconSearch } from "@tabler/icons-react";
import useHasToken from "@/hooks/useHasToken";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hasToken = useHasToken();

  useEffect(() => {
    if (hasToken) {
      router.replace("/");
    }
  }, [hasToken, router]);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <div
        aria-hidden="true"
        className="hidden flex-col justify-between bg-gradient-to-br from-indigo-700 to-indigo-900 p-12 text-white lg:flex"
      >
        <div className="flex items-center gap-3 text-xl font-bold">
          <IconSearch size={28} stroke={2.5} />
          Postingan
        </div>
        <div className="space-y-4">
          <p className="text-4xl font-bold leading-tight">
            Bagikan cerita, beri suka, dan mulai percakapan.
          </p>
          <p className="text-lg text-indigo-100">
            Satu linimasa untuk semua pengguna: unggah gambar, tulis deskripsi, dan berkomentar.
          </p>
        </div>
        <p className="text-sm text-indigo-100">Praktikum PABWE 2026</p>
      </div>
      <main id="main-content" className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
