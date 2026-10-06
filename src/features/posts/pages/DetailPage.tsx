"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconEdit,
  IconHeart,
  IconHeartFilled,
  IconPhoto,
  IconTrash,
} from "@tabler/icons-react";
import clsx from "clsx";
import Avatar from "@/components/Avatar";
import FormField from "@/components/FormField";
import { formatDate, showConfirmDialog } from "@/helpers/toolsHelper";
import {
  getAuthor,
  getCommentAuthorName,
  getCommentsCount,
  getCommentsList,
  getLikesCount,
  isCommentOwnedBy,
  isLikedBy,
  isOwnedBy,
} from "@/helpers/postHelper";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import ChangeCoverModal from "../modals/ChangeCoverModal";
import ChangeModal from "../modals/ChangeModal";
import {
  asyncAddComment,
  asyncDeleteComment,
  asyncDeletePost,
  asyncLikePost,
  asyncSetPost,
  setPostActionCreator,
} from "../states/action";

export default function DetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const post = useAppSelector((state) => state.post);
  const isLoading = useAppSelector((state) => state.isPost);
  const profile = useAppSelector((state) => state.profile);
  const isLiking = useAppSelector((state) => state.isPostLike);
  const isCommenting = useAppSelector((state) => state.isPostAddComment);
  const [modal, setModal] = useState<"cover" | "change" | null>(null);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    dispatch(asyncSetPost(postId));
    return () => {
      dispatch(setPostActionCreator(null));
    };
  }, [dispatch, postId]);

  function reload() {
    dispatch(asyncSetPost(postId));
  }

  async function handleLike() {
    const ok = await dispatch(asyncLikePost(postId));
    if (ok) {
      reload();
    }
  }

  async function handleComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!comment.trim()) {
      setCommentError("Komentar wajib diisi.");
      return;
    }
    setCommentError("");
    const ok = await dispatch(asyncAddComment(postId, comment.trim()));
    if (ok) {
      setComment("");
      reload();
    }
  }

  async function handleDeleteComment(commentId: string) {
    const confirmed = await showConfirmDialog(
      "Hapus komentar?",
      "Komentar yang dihapus tidak dapat dikembalikan.",
      "Ya, hapus"
    );
    if (!confirmed) {
      return;
    }
    const ok = await dispatch(asyncDeleteComment(postId, commentId));
    if (ok) {
      reload();
    }
  }

  async function handleDeletePost() {
    const confirmed = await showConfirmDialog(
      "Hapus postingan?",
      "Postingan yang dihapus tidak dapat dikembalikan.",
      "Ya, hapus"
    );
    if (!confirmed) {
      return;
    }
    const ok = await dispatch(asyncDeletePost(postId));
    if (ok) {
      router.replace("/");
    }
  }

  const backLink = (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-800 hover:underline"
    >
      <IconArrowLeft size={18} aria-hidden="true" />
      Kembali ke semua postingan
    </Link>
  );

  if (isLoading && !post) {
    return (
      <div role="status" aria-live="polite" className="p-6 text-sm text-slate-700">
        Memuat detail postingan…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-4">
        {backLink}
        <h1 className="text-2xl font-bold text-slate-900">Postingan tidak ditemukan</h1>
        <p className="text-slate-700">Postingan yang kamu cari mungkin sudah dihapus.</p>
      </div>
    );
  }

  const author = getAuthor(post);
  const comments = getCommentsList(post);
  const liked = isLikedBy(post, profile);
  const owner = isOwnedBy(post, profile);
  const actionClass =
    "inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ring-1";

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      {backLink}

      {post.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover}
          alt={`Gambar postingan dari ${author.name}`}
          width={768}
          height={432}
          decoding="async"
          className="max-h-[28rem] w-full rounded-2xl bg-slate-100 object-contain"
        />
      ) : null}

      <div className="flex items-center gap-3">
        <Avatar name={author.name} photo={author.photo} size="md" />
        <div>
          <h1 className="text-xl font-bold text-slate-900">Postingan dari {author.name}</h1>
          <p className="text-sm text-slate-700">{formatDate(post.created_at)}</p>
        </div>
      </div>

      <p className="whitespace-pre-line text-slate-800">{post.description}</p>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleLike}
          disabled={isLiking}
          aria-pressed={liked}
          className={clsx(
            actionClass,
            liked
              ? "bg-rose-50 text-rose-800 ring-rose-600"
              : "bg-white text-slate-800 ring-slate-400 hover:bg-slate-100"
          )}
        >
          {liked ? (
            <IconHeartFilled size={18} aria-hidden="true" />
          ) : (
            <IconHeart size={18} aria-hidden="true" />
          )}
          {getLikesCount(post)} suka
        </button>
        <p className="text-sm text-slate-700">{getCommentsCount(post)} komentar</p>
      </div>

      {owner ? (
        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={() => setModal("cover")}
            className={clsx(actionClass, "bg-white text-slate-800 ring-slate-400 hover:bg-slate-100")}
          >
            <IconPhoto size={18} aria-hidden="true" />
            Ubah gambar
          </button>
          <button
            type="button"
            onClick={() => setModal("change")}
            className={clsx(actionClass, "bg-indigo-700 text-white ring-indigo-700 hover:bg-indigo-800")}
          >
            <IconEdit size={18} aria-hidden="true" />
            Ubah postingan
          </button>
          <button
            type="button"
            onClick={handleDeletePost}
            className={clsx(actionClass, "bg-red-700 text-white ring-red-700 hover:bg-red-800")}
          >
            <IconTrash size={18} aria-hidden="true" />
            Hapus postingan
          </button>
        </div>
      ) : null}

      <section aria-labelledby="komentar-title" className="space-y-4 border-t border-slate-200 pt-6">
        <h2 id="komentar-title" className="text-lg font-bold text-slate-900">
          Komentar
        </h2>

        <form onSubmit={handleComment} noValidate className="space-y-3">
          <FormField
            id="comment-input"
            label="Tulis komentar"
            as="textarea"
            rows={3}
            value={comment}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setComment(event.target.value)}
            placeholder="Tulis komentarmu di sini"
            error={commentError}
          />
          <button
            type="submit"
            disabled={isCommenting}
            className="rounded-lg bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-70"
          >
            {isCommenting ? "Mengirim…" : "Kirim komentar"}
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="text-sm text-slate-700">Belum ada komentar.</p>
        ) : (
          <ul className="space-y-3">
            {comments.map((item) => (
              <li key={item.id} className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{getCommentAuthorName(item)}</p>
                    <p className="text-xs text-slate-700">{formatDate(item.created_at)}</p>
                  </div>
                  {isCommentOwnedBy(item, profile) ? (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(item.id)}
                      aria-label={`Hapus komentar dari ${getCommentAuthorName(item)}`}
                      className="rounded-lg p-1.5 text-red-700 hover:bg-red-50"
                    >
                      <IconTrash size={18} aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-800">{item.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {modal === "cover" ? (
        <ChangeCoverModal post={post} onClose={() => setModal(null)} onSuccess={reload} />
      ) : null}
      {modal === "change" ? (
        <ChangeModal post={post} onClose={() => setModal(null)} onSuccess={reload} />
      ) : null}
    </article>
  );
}
