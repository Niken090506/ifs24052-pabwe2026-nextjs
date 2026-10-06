import type { Metadata } from "next";
import HomePage from "@/features/posts/pages/HomePage";

export const metadata: Metadata = {
  title: "Semua Postingan",
  description: "Linimasa berisi postingan terbaru dari semua pengguna.",
};

export default function Page() {
  return <HomePage mode="all" />;
}
