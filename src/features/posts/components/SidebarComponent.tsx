"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { IconArticle, IconUser, IconUserCircle, IconUsers, IconX } from "@tabler/icons-react";

const MENU = [
  { label: "Semua Postingan", href: "/", icon: IconArticle },
  { label: "Postingan Saya", href: "/saya", icon: IconUserCircle },
  { label: "Daftar Pengguna", href: "/users", icon: IconUsers },
  { label: "Profil Saya", href: "/profile", icon: IconUser },
];

function isActive(href: string, pathname: string) {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/posts/");
  }
  return pathname === href;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SidebarComponent({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen ? (
        <button
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
        />
      ) : null}
      <aside
        id="sidebar-navigation"
        className={clsx(
          "z-50 w-64 shrink-0 border-r border-slate-200 bg-white p-4",
          isOpen ? "fixed inset-y-0 left-0 block lg:static" : "hidden lg:block"
        )}
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <span className="font-bold text-slate-900">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="rounded-lg p-1.5 hover:bg-slate-100"
          >
            <IconX size={20} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Navigasi utama">
          <ul className="space-y-1">
            {MENU.map((item) => {
              const active = isActive(item.href, pathname);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={clsx(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold",
                      active ? "bg-indigo-100 text-indigo-900" : "text-slate-800 hover:bg-slate-100"
                    )}
                  >
                    <Icon size={20} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
