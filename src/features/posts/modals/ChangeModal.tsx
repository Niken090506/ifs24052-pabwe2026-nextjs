"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import FormField from "@/components/FormField";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import type { Post } from "@/types";
import { asyncChangePost } from "../states/action";
import ModalShell from "./ModalShell";

interface ChangeModalProps {
  post: Post;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ChangeModal({ post, onClose, onSuccess }: ChangeModalProps) {
  const dispatch = useAppDispatch();
  const isChanging = useAppSelector((state) => state.isPostChange);
  const [description, setDescription] = useState(post.description || "");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!description.trim()) {
      setError("Deskripsi wajib diisi.");
      return;
    }
    setError("");
    const ok = await dispatch(asyncChangePost(post.id, description.trim()));
    if (ok) {
      onSuccess();
      onClose();
    }
  }

  return (
    <ModalShell titleId="change-modal-title" title="Ubah postingan" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          id="change-description"
          label="Deskripsi"
          as="textarea"
          rows={5}
          value={description}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
          error={error}
        />
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
            {isChanging ? "Menyimpan…" : "Simpan perubahan"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
