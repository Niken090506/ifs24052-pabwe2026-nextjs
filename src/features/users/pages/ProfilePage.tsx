"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Avatar from "@/components/Avatar";
import FormField from "@/components/FormField";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useFilePreview from "@/hooks/useFilePreview";
import { showWarningDialog } from "@/helpers/toolsHelper";
import type { User } from "@/types";
import {
  asyncChangeProfile,
  asyncChangeProfilePassword,
  asyncChangeProfilePhoto,
} from "../states/action";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PHOTO_SIZE = 2 * 1024 * 1024;
const BUTTON_CLASS =
  "rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-70";
const CARD_CLASS = "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200";

interface InfoErrors {
  name?: string;
  email?: string;
}

interface PasswordErrors {
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
}

function InfoSection({ profile }: { profile: User | null }) {
  const dispatch = useAppDispatch();
  const isChanging = useAppSelector((state) => state.isChangeProfile);
  const [name, setName] = useState(profile?.name ?? "");
  const [email, setEmail] = useState(profile?.email ?? "");
  const [errors, setErrors] = useState<InfoErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation: InfoErrors = {};
    if (!name.trim()) {
      validation.name = "Nama wajib diisi.";
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      validation.email = "Format email tidak valid.";
    }
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }
    await dispatch(asyncChangeProfile(name.trim(), email.trim()));
  }

  return (
    <section aria-labelledby="profile-info-title" className={CARD_CLASS}>
      <h2 id="profile-info-title" className="text-lg font-bold text-slate-900">
        Informasi akun
      </h2>
      <form onSubmit={handleSubmit} noValidate className="mt-4 max-w-lg space-y-4">
        <FormField
          id="profile-name"
          label="Nama lengkap"
          autoComplete="name"
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          error={errors.name}
        />
        <FormField
          id="profile-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
          error={errors.email}
        />
        <button type="submit" disabled={isChanging} className={BUTTON_CLASS}>
          {isChanging ? "Menyimpan…" : "Simpan perubahan"}
        </button>
      </form>
    </section>
  );
}

function PhotoSection({ profile }: { profile: User | null }) {
  const dispatch = useAppDispatch();
  const isChanging = useAppSelector((state) => state.isChangeProfilePhoto);
  const { file, url, setFile } = useFilePreview();

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
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
    if (selected.size > MAX_PHOTO_SIZE) {
      await showWarningDialog("Ukuran foto maksimal 2 MB.");
      event.target.value = "";
      return;
    }
    setFile(selected);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      await showWarningDialog("Pilih foto terlebih dahulu.");
      return;
    }
    const ok = await dispatch(asyncChangeProfilePhoto(file));
    if (ok) {
      setFile(null);
    }
  }

  return (
    <section aria-labelledby="profile-photo-title" className={CARD_CLASS}>
      <h2 id="profile-photo-title" className="text-lg font-bold text-slate-900">
        Foto profil
      </h2>
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center"
      >
        <Avatar name={profile?.name} photo={url || profile?.photo} size="lg" />
        <div className="space-y-3">
          <FormField
            id="profile-photo"
            label="Pilih foto baru"
            type="file"
            accept="image/*"
            onChange={handleChange}
            hint="Format gambar, ukuran maksimal 2 MB."
          />
          <button type="submit" disabled={isChanging} className={BUTTON_CLASS}>
            {isChanging ? "Mengunggah…" : "Unggah foto"}
          </button>
        </div>
      </form>
    </section>
  );
}

function PasswordSection() {
  const dispatch = useAppDispatch();
  const isChanging = useAppSelector((state) => state.isChangeProfilePassword);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<PasswordErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation: PasswordErrors = {};
    if (!password) {
      validation.password = "Kata sandi saat ini wajib diisi.";
    }
    if (newPassword.length < 6) {
      validation.newPassword = "Kata sandi baru minimal 6 karakter.";
    }
    if (confirmPassword !== newPassword) {
      validation.confirmPassword = "Konfirmasi kata sandi tidak sama.";
    }
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }
    const ok = await dispatch(asyncChangeProfilePassword(password, newPassword));
    if (ok) {
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <section aria-labelledby="profile-password-title" className={CARD_CLASS}>
      <h2 id="profile-password-title" className="text-lg font-bold text-slate-900">
        Ubah kata sandi
      </h2>
      <form onSubmit={handleSubmit} noValidate className="mt-4 max-w-lg space-y-4">
        <FormField
          id="profile-current-password"
          label="Kata sandi saat ini"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
          error={errors.password}
        />
        <FormField
          id="profile-new-password"
          label="Kata sandi baru"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setNewPassword(event.target.value)}
          error={errors.newPassword}
        />
        <FormField
          id="profile-confirm-password"
          label="Konfirmasi kata sandi baru"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
        />
        <button type="submit" disabled={isChanging} className={BUTTON_CLASS}>
          {isChanging ? "Menyimpan…" : "Ubah kata sandi"}
        </button>
      </form>
    </section>
  );
}

export default function ProfilePage() {
  const profile = useAppSelector((state) => state.profile);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profil Saya</h1>
        <p className="mt-1 text-sm text-slate-700">
          Perbarui data akun, foto profil, dan kata sandimu.
        </p>
      </div>
      {/* key membuat form terisi ulang ketika profil selesai dimuat */}
      <InfoSection key={profile?.id ?? "kosong"} profile={profile} />
      <PhotoSection profile={profile} />
      <PasswordSection />
    </div>
  );
}
