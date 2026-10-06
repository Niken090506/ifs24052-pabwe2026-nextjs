"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import RouteFallback from "@/components/RouteFallback";
import apiHelper from "@/helpers/apiHelper";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useHasToken from "@/hooks/useHasToken";
import { asyncSetIsAuthLogout } from "@/features/auth/states/action";
import { asyncSetProfile } from "@/features/users/states/action";
import NavbarComponent from "../components/NavbarComponent";
import SidebarComponent from "../components/SidebarComponent";

export default function PostLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const profile = useAppSelector((state) => state.profile);
  const hasToken = useHasToken();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!hasToken) {
      router.replace("/auth/login");
      return;
    }
    dispatch(asyncSetProfile()).then((ok) => {
      if (!ok) {
        apiHelper.putAccessToken("");
        router.replace("/auth/login");
      }
    });
  }, [hasToken, dispatch, router]);

  async function handleLogout() {
    await dispatch(asyncSetIsAuthLogout());
    router.replace("/auth/login");
  }

  if (!hasToken) {
    return <RouteFallback />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-indigo-800"
      >
        Lewati ke konten utama
      </a>
      <NavbarComponent
        profile={profile}
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((value) => !value)}
        onLogout={handleLogout}
      />
      <div className="flex">
        <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
