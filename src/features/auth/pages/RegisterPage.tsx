"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import { asyncSetIsAuthRegister, setIsAuthRegisterActionCreator } from "../states/action";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateRegister(
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): RegisterErrors {
  const errors: RegisterErrors = {};
  if (!name.trim()) {
    errors.name = "Nama wajib diisi.";
  }
  if (!email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Format email tidak valid.";
  }
  if (password.length < 6) {
    errors.password = "Kata sandi minimal 6 karakter.";
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = "Konfirmasi kata sandi tidak sama.";
  }
  return errors;
}

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthRegister = useAppSelector((state) => state.isAuthRegister);
  const [name, onNameChange] = useInput("");
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [confirmPassword, onConfirmChange] = useInput("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthRegister) {
      dispatch(setIsAuthRegisterActionCreator(false));
      router.replace("/auth/login");
    }
  }, [isAuthRegister, dispatch, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateRegister(name, email, password, confirmPassword);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }
    setSubmitting(true);
    await dispatch(asyncSetIsAuthRegister(name.trim(), email.trim(), password));
    setSubmitting(false);
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
      <h1 className="text-2xl font-bold text-slate-900">Buat akun baru</h1>
      <p className="mt-1 text-sm text-slate-700">Daftar untuk mulai membagikan ceritamu.</p>
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <FormField
          id="register-name-input"
          label="Nama lengkap"
          name="name"
          autoComplete="name"
          placeholder="Nama lengkap"
          value={name}
          onChange={onNameChange}
          error={errors.name}
        />
        <FormField
          id="register-email-input"
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="nama@email.com"
          value={email}
          onChange={onEmailChange}
          error={errors.email}
        />
        <FormField
          id="register-password-input"
          label="Kata sandi"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Minimal 6 karakter"
          value={password}
          onChange={onPasswordChange}
          error={errors.password}
        />
        <FormField
          id="register-confirm-input"
          label="Konfirmasi kata sandi"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Ulangi kata sandi"
          value={confirmPassword}
          onChange={onConfirmChange}
          error={errors.confirmPassword}
        />
        <button
          id="register-submit-button"
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-70"
        >
          {submitting ? "Memproses…" : "Daftar"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-700">
        Sudah punya akun?{" "}
        <Link href="/auth/login" className="font-semibold text-indigo-700 underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
