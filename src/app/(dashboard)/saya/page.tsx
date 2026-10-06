import type { Metadata } from "next";
import HomePage from "@/features/posts/pages/HomePage";

export const metadata: Metadata = {
  title: "Postingan Saya",
  description: "Kelola postingan milikmu sendiri.",
};

export default function Page() {
  return <HomePage mode="me" />;
}
