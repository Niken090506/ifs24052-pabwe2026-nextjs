import type { Metadata } from "next";
import UsersPage from "@/features/users/pages/UsersPage";

export const metadata: Metadata = {
  title: "Pengguna",
  description: "Daftar pengguna aplikasi Postingan.",
};

export default function Page() {
  return <UsersPage />;
}
