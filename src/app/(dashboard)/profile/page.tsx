import type { Metadata } from "next";
import ProfilePage from "@/features/users/pages/ProfilePage";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "Perbarui data akun, foto profil, dan kata sandi.",
};

export default function Page() {
  return <ProfilePage />;
}
