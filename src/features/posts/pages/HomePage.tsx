"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IconHeart, IconMessageCircle, IconPlus, IconTrash } from "@tabler/icons-react";
import Avatar from "@/components/Avatar";
import { formatDate, showConfirmDialog } from "@/helpers/toolsHelper";
import {
  getAuthor,
  getCommentsCount,
  getLikesCount,
} from "@/helpers/postHelper";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import AddModal from "../modals/AddModal";
import { asyncDeleteAllPosts, asyncSetPosts } from "../states/action";

interface HomePageProps {
  mode: "all" | "me";
}

export default function HomePage({ mode }: HomePageProps) {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts);
  const isLoading = useAppSelector((state) => state.isPost);
  const [keyword, setKeyword] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const isMe = mode === "me";

  useEffect(() => {
    dispatch(asyncSetPosts(isMe));
  }, [dispatch, isMe]);

  const visible = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) {
      return posts;
    }
    return posts.filter(
      (post) =>
        String(post.description || "").toLowerCase().includes(query) ||
        getAuthor(post).name.toLowerCase().includes(query)
    );
  }, [posts, keyword]);

  function refresh() {
    dispatch(asyncSetPosts(isMe));
  }

  async function handleDeleteAll() {
    const confirmed = await showConfirmDialog(
      "Hapus semua postingan?",
      "Semua postinganmu akan dihapus dan tidak dapat dikembalikan.",
      "Ya, hapus semua"
    );
    if (!confirmed) {
      return;
    }
    const ok = await dispatch(asyncDeleteAllPosts());
    if (ok) {
      refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isMe ? "Postingan Saya" : "Semua Postingan"}
          </h1>
          <p className="mt-1 text-sm text-slate-700">
            {isMe
              ? "Kelola cerita yang sudah kamu bagikan."
              : "Cerita terbaru dari semua pengguna."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {isMe ? (
            <button
              type="button"
              onClick={handleDeleteAll}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-red-700 ring-1 ring-red-600 hover:bg-red-50"
            >
              <IconTrash size={18} aria-hidden="true" />
              Hapus semua postingan saya
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800"
          >
            <IconPlus size={18} aria-hidden="true" />
            Buat postingan
          </button>
        </div>
      </div>

      <div className="max-w-md">
        <label htmlFor="post-search" className="mb-1.5 block text-sm font-semibold text-slate-800">
          Cari postingan
        </label>
        <input
          id="post-search"
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Ketik isi postingan atau nama pengguna"
          className="block w-full rounded-lg border border-slate-400 bg-white px-3 py-2.5 text-sm placeholder:text-slate-500"
        />
      </div>

      <p role="status" aria-live="polite" className="text-sm text-slate-700">
        {isLoading ? "Memuat postingan…" : `${visible.length} postingan ditampilkan`}
      </p>

      {!isLoading && visible.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-slate-700 ring-1 ring-slate-200">
          Belum ada postingan yang cocok.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((post) => {
            const author = getAuthor(post);
            return (
              <li key={post.id}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                  {post.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover}
                      alt={`Gambar postingan dari ${author.name}`}
                      width={640}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      className="aspect-video w-full bg-slate-100 object-cover"
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={author.name} photo={author.photo} size="md" />
                      <div className="min-w-0">
                        <h2 className="truncate font-semibold text-slate-900">{author.name}</h2>
                        <p className="text-xs text-slate-700">{formatDate(post.created_at)}</p>
                      </div>
                    </div>
                    <p className="line-clamp-4 whitespace-pre-line text-sm text-slate-800">
                      {post.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <p className="flex items-center gap-4 text-sm text-slate-700">
                        <span className="inline-flex items-center gap-1.5">
                          <IconHeart size={18} aria-hidden="true" />
                          <span>{getLikesCount(post)} suka</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <IconMessageCircle size={18} aria-hidden="true" />
                          <span>{getCommentsCount(post)} komentar</span>
                        </span>
                      </p>
                      <Link
                        href={`/posts/${post.id}`}
                        aria-label={`Lihat detail postingan dari ${author.name}`}
                        className="text-sm font-semibold text-indigo-800 underline"
                      >
                        Lihat detail
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      {showAdd ? <AddModal onClose={() => setShowAdd(false)} onSuccess={refresh} /> : null}
    </div>
  );
}
