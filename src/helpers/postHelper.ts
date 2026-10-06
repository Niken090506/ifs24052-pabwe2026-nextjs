import type { Post, PostAuthor, PostComment, User } from "@/types";

type Owner = Pick<User, "id"> | null | undefined;

export function getAuthor(post: Post): PostAuthor {
  return post.user ?? post.author ?? { id: post.user_id ?? "", name: "Pengguna" };
}

export function getCommentsList(post: Post): PostComment[] {
  return Array.isArray(post.comments) ? post.comments : [];
}

export function getLikesCount(post: Post): number {
  if (typeof post.total_likes === "number") {
    return post.total_likes;
  }
  if (Array.isArray(post.likes)) {
    return post.likes.length;
  }
  return typeof post.likes === "number" ? post.likes : 0;
}

export function getCommentsCount(post: Post): number {
  if (typeof post.total_comments === "number") {
    return post.total_comments;
  }
  if (Array.isArray(post.comments)) {
    return post.comments.length;
  }
  return typeof post.comments === "number" ? post.comments : 0;
}

export function isLikedBy(post: Post, owner: Owner): boolean {
  if (!owner || !Array.isArray(post.likes)) {
    return false;
  }
  return post.likes.some((like) => {
    const item = like as { user_id?: string; id?: string } | null;
    return item?.user_id === owner.id || item?.id === owner.id;
  });
}

// Bila pemilik tidak diketahui dari API, aksi tetap ditampilkan
// dan server yang memutuskan hak akses.
export function isOwnedBy(post: Post, owner: Owner): boolean {
  const ownerId = post.user_id ?? post.user?.id ?? post.author?.id;
  if (ownerId === undefined || ownerId === null || ownerId === "") {
    return true;
  }
  return ownerId === owner?.id;
}

export function getCommentAuthorName(comment: PostComment): string {
  return comment.user?.name ?? comment.name ?? "Pengguna";
}

export function isCommentOwnedBy(comment: PostComment, owner: Owner): boolean {
  const ownerId = comment.user_id ?? comment.user?.id;
  if (ownerId === undefined || ownerId === null || ownerId === "") {
    return true;
  }
  return ownerId === owner?.id;
}
