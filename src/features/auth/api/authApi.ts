import apiHelper from "@/helpers/apiHelper";
import { parseResponse } from "@/helpers/responseHelper";
import { DELCOM_BASEURL } from "@/lib/config";

const BASE_URL = `${DELCOM_BASEURL}/auth`;

function _url(path: string) {
  return BASE_URL + path;
}

async function postLogin(email: string, password: string) {
  const response = await apiHelper.fetchData(_url("/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const result = await parseResponse<{ token: string }>(response, "Gagal masuk ke akun");
  return result.data as { token: string };
}

async function postRegister(name: string, email: string, password: string) {
  const response = await apiHelper.fetchData(_url("/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const result = await parseResponse(response, "Gagal mendaftarkan akun");
  return result.message as string;
}

async function postLogout() {
  const response = await apiHelper.fetchData(_url("/logout"), {
    method: "POST",
  });
  const result = await parseResponse(response, "Gagal keluar dari akun");
  return result.message as string;
}

const authApi = { postLogin, postRegister, postLogout };

export default authApi;
