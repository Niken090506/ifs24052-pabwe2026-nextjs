"use client";

import { useState, type FormEvent } from "react";
import FormField from "@/components/FormField";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import { asyncAddPost } from "../states/action";
import ModalShell from "./ModalShell";

interface AddModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddModal({ onClose, onSuccess }: AddModalProps) {
  const dispatch = useAppDispatch();
  const isAdding = useAppSelector((state) => state.isPostAdd);
  const [description, onDescriptionChange] = useInput("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!description.trim()) {
      setError("Deskripsi wajib diisi.");
      return;
    }
    setError("");
    const ok = await dispatch(asyncAddPost(description.trim()));
    if (ok) {
      onSuccess();
      onClose();
    }
  }

  return (
    <ModalShell titleId="add-modal-title" title="Buat postingan" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <FormField
          id="add-description"
          label="Apa yang ingin kamu bagikan?"
          as="textarea"
          rows={5}
          value={description}
          onChange={onDescriptionChange}
          placeholder="Tulis ceritamu di sini"
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
            disabled={isAdding}
            className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-70"
          >
            {isAdding ? "Mengirim…" : "Kirim postingan"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
