"use client";

import type { ChangeEvent, FormEvent } from "react";
import FormField from "@/components/FormField";
import { showWarningDialog } from "@/helpers/toolsHelper";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useFilePreview from "@/hooks/useFilePreview";
import type { Post } from "@/types";
import { asyncChangePostCover } from "../states/action";
import ModalShell from "./ModalShell";

const MAX_SIZE = 2 * 1024 * 1024;

interface ChangeCoverModalProps {
  post: Post;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChangeCoverModal({ post, onClose, onSuccess }: ChangeCoverModalProps) {
  const dispatch = useAppDispatch();
  const isChanging = useAppSelector((state) => state.isPostChangeCover);
  const { file, url, setFile } = useFilePreview();

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) {
      setFile(null);
      return;
    }
    if (!selected.type.startsWith("image/")) {
      await showWarningDialog("Berkas harus berupa gambar.");
      event.target.value = "";
      return;
    }
    if (selected.size > MAX_SIZE) {
      await showWarningDialog("Ukuran gambar maksimal 2 MB.");
      event.target.value = "";
      return;
    }
    setFile(selected);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      await showWarningDialog("Pilih gambar terlebih dahulu.");
      return;
    }
    const ok = await dispatch(asyncChangePostCover(post.id, file));
    if (ok) {
      onSuccess();
      onClose();
    }
  }

  const shown = url || post.cover;

  return (
    <ModalShell titleId="cover-modal-title" title="Ubah gambar postingan" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="cover-file"
          label="Pilih gambar"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hint="Format gambar, ukuran maksimal 2 MB."
        />
        {shown ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shown}
            alt={url ? "Pratinjau gambar yang dipilih" : "Gambar postingan saat ini"}
            width={480}
            height={270}
            className="aspect-video w-full rounded-lg bg-slate-100 object-contain"
          />
        ) : (
          <p className="rounded-lg bg-slate-100 p-4 text-center text-sm text-slate-700">
            Belum ada gambar.
          </p>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-slate-400 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isChanging}
            className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-70"
          >
            {isChanging ? "Mengunggah…" : "Unggah gambar"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
