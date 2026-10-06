import { useSyncExternalStore } from "react";
import apiHelper from "@/helpers/apiHelper";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/**
 * Menandakan apakah token login tersimpan di browser.
 * Aman untuk SSR: di server nilainya selalu false, di browser dibaca dari localStorage.
 */
export default function useHasToken(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => Boolean(apiHelper.getAccessToken()),
    () => false
  );
}
