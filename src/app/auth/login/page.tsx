import type { Metadata } from "next";
import LoginPage from "@/features/auth/pages/LoginPage";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun Postingan untuk melihat linimasa dan membagikan ceritamu.",
};

export default function Page() {
  return <LoginPage />;
}
