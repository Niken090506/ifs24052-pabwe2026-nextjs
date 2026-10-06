"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormField from "@/components/FormField";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useInput from "@/hooks/useInput";
import { asyncSetIsAuthLogin } from "../states/action";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LoginErrors {
  email?: string;
  password?: string;
}

export function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  if (!email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Format email tidak valid.";
  }
  if (!password) {
    errors.password = "Kata sandi wajib diisi.";
  }
  return errors;
}

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthLogin = useAppSelector((state) => state.isAuthLogin);
  const [email, onEmailChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthLogin) {
      router.replace("/");
    }
  }, [isAuthLogin, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateLogin(email, password);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      return;
    }
    setSubmitting(true);
    await dispatch(asyncSetIsAuthLogin(email.trim(), password));
    setSubmitting(false);
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
      <h1 className="text-2xl font-bold text-slate-900">Masuk ke akunmu</h1>
      <p className="mt-1 text-sm text-slate-700">Lihat linimasa dan bagikan ceritamu.</p>
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <FormField
          id="login-email-input"
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
          id="login-password-input"
          label="Kata sandi"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Masukkan kata sandi"
          value={password}
          onChange={onPasswordChange}
          error={errors.password}
        />
        <button
          id="login-submit-button"
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-70"
        >
          {submitting ? "Memproses…" : "Masuk"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-700">
        Belum punya akun?{" "}
        <Link href="/auth/register" className="font-semibold text-indigo-700 underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
