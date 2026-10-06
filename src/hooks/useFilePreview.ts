import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Menyimpan berkas yang dipilih beserta URL pratinjaunya,
 * dan membersihkan URL objek saat berganti atau saat komponen dilepas.
 */
export default function useFilePreview() {
  const [file, setFileState] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const urlRef = useRef("");

  const setFile = useCallback((next: File | null) => {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
    }
    urlRef.current = next ? URL.createObjectURL(next) : "";
    setUrl(urlRef.current);
    setFileState(next);
  }, []);

  useEffect(
    () => () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
      }
    },
    []
  );

  return { file, url, setFile };
}
