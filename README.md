# Postingan (ifs24052-pabwe2026-nextjs)

Studi Kasus 2.2 Praktikum PABWE 2026: aplikasi linimasa Postingan memakai Next.js (App Router), TypeScript, Redux Toolkit, dan Tailwind CSS v4 dengan API Delcom.

## Menjalankan

```bash
bun install
bun run dev      # http://localhost:3000 (port dari APP_PORT di .env)
bun run build    # build produksi
bun run lint     # ESLint
```

## Environment

Salin `.env.example` menjadi `.env`, lalu isi:

```
NEXT_PUBLIC_DELCOM_BASEURL=https://open-api.delcom.org/api/v1
APP_PORT=3000
```

## Deploy (Vercel)

1. Push ke GitHub.
2. Import di vercel.com dengan nama proyek `ifs24052-pabwe2026-nextjs`.
3. Tambahkan environment variable `NEXT_PUBLIC_DELCOM_BASEURL`.

## Struktur singkat

- `src/app` rute App Router (auth, dashboard, robots, icon)
- `src/features/{auth,users,posts}` api, state (action/reducer), halaman, modal
- `src/helpers`, `src/hooks`, `src/components` utilitas bersama
