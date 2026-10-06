import apiHelper from "@/helpers/apiHelper";
import { parseResponse } from "@/helpers/responseHelper";
import { DELCOM_BASEURL } from "@/lib/config";
import type { Post } from "@/types";

const BASE_URL = `${DELCOM_BASEURL}/posts`;

function _url(path: string) {
  return BASE_URL + path;
}

async function getPosts(isMe = false): Promise<Post[]> {
  const response = await apiHelper.fetchData(_url(isMe ? "/?is_me=1" : "/"), {
    method: "GET",
  });
  const result = await parseResponse<{ posts?: Post[] }>(
    response,
    "Gagal mengambil data postingan"
  );
  return result.data?.posts || [];
}

async function getPostById(postId: string): Promise<Post | null> {
  const response = await apiHelper.fetchData(_url(`/${postId}`), {
    method: "GET",
  });
  const result = await parseResponse<{ post?: Post }>(
    response,
    "Gagal mengambil detail postingan"
  );
  return result.data?.post ?? null;
}

async function postPost(description: string) {
  const response = await apiHelper.fetchData(_url("/"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  const result = await parseResponse(response, "Gagal menambahkan postingan");
  return result.message as string;
}

async function putPost(postId: string, description: string) {
  const response = await apiHelper.fetchData(_url(`/${postId}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  const result = await parseResponse(response, "Gagal mengubah postingan");
  return result.message as string;
}

async function postPostCover(postId: string, cover: File) {
  const formData = new FormData();
  formData.append("cover", cover, cover.name || "cover.jpg");
  const response = await apiHelper.fetchData(_url(`/${postId}/cover`), {
    method: "POST",
    body: formData,
  });
  const result = await parseResponse(response, "Gagal mengubah cover");
  return result.message as string;
}

async function deletePost(postId: string) {
  const response = await apiHelper.fetchData(_url(`/${postId}`), {
    method: "DELETE",
  });
  const result = await parseResponse(response, "Gagal menghapus postingan");
  return result.message as string;
}

async function postLike(postId: string) {
  const response = await apiHelper.fetchData(_url(`/${postId}/likes`), {
    method: "POST",
  });
  const result = await parseResponse(response, "Gagal memproses suka");
  return result.message as string;
}

async function postComment(postId: string, comment: string) {
  const response = await apiHelper.fetchData(_url(`/${postId}/comments`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment }),
  });
  const result = await parseResponse(response, "Gagal menambahkan komentar");
  return result.message as string;
}

// ID komentar dikirim lewat query dan body agar cocok dengan bentuk endpoint API.
async function deleteComment(postId: string, commentId: string) {
  const response = await apiHelper.fetchData(
    _url(`/${postId}/comments?comment_id=${encodeURIComponent(commentId)}`),
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment_id: commentId }),
    }
  );
  const result = await parseResponse(response, "Gagal menghapus komentar");
  return result.message as string;
}

async function deleteAllPosts() {
  const response = await apiHelper.fetchData(_url("/"), { method: "DELETE" });
  const result = await parseResponse(response, "Gagal menghapus semua postingan");
  return result.message as string;
}

const postApi = {
  getPosts,
  getPostById,
  postPost,
  putPost,
  postPostCover,
  deletePost,
  postLike,
  postComment,
  deleteComment,
  deleteAllPosts,
};

export default postApi;
