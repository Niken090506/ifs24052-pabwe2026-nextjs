import type { Metadata } from "next";
import RegisterPage from "@/features/auth/pages/RegisterPage";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun Postingan untuk mulai membagikan cerita dan berinteraksi.",
};

export default function Page() {
  return <RegisterPage />;
}
