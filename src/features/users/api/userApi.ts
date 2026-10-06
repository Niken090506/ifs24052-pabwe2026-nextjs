import apiHelper from "@/helpers/apiHelper";
import { parseResponse } from "@/helpers/responseHelper";
import { DELCOM_BASEURL } from "@/lib/config";
import type { User } from "@/types";

const BASE_URL = `${DELCOM_BASEURL}/users`;

function _url(path: string) {
  return BASE_URL + path;
}

async function getUsers(): Promise<User[]> {
  const response = await apiHelper.fetchData(_url("/"), { method: "GET" });
  const result = await parseResponse<{ users?: User[] }>(
    response,
    "Gagal mengambil daftar pengguna"
  );
  return result.data?.users || [];
}

async function getMe(): Promise<User | undefined> {
  const response = await apiHelper.fetchData(_url("/me"), { method: "GET" });
  const result = await parseResponse<{ user?: User }>(
    response,
    "Gagal mengambil data profil"
  );
  return result.data?.user;
}

async function putMe(name: string, email: string) {
  const response = await apiHelper.fetchData(_url("/me"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  const result = await parseResponse(response, "Gagal mengubah profil");
  return result.message as string;
}

async function postMePhoto(photo: File) {
  const formData = new FormData();
  formData.append("photo", photo, photo.name || "photo.jpg");
  const response = await apiHelper.fetchData(_url("/me/photo"), {
    method: "POST",
    body: formData,
  });
  const result = await parseResponse(response, "Gagal mengubah foto profil");
  return result.message as string;
}

async function putMePassword(password: string, newPassword: string) {
  const response = await apiHelper.fetchData(_url("/me/password"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, new_password: newPassword }),
  });
  const result = await parseResponse(response, "Gagal mengubah kata sandi");
  return result.message as string;
}

const userApi = { getUsers, getMe, putMe, postMePhoto, putMePassword };

export default userApi;
