import apiHelper from "@/helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "@/helpers/toolsHelper";
import type { AppDispatch } from "@/store";
import type { AppAction } from "@/types/action";
import authApi from "../api/authApi";

export const ActionType = {
  SET_IS_AUTH_LOGIN: "SET_IS_AUTH_LOGIN",
  SET_IS_AUTH_REGISTER: "SET_IS_AUTH_REGISTER",
  SET_IS_AUTH_LOGOUT: "SET_IS_AUTH_LOGOUT",
} as const;

// Login
export function setIsAuthLoginActionCreator(isAuthLogin: boolean): AppAction<boolean> {
  return { type: ActionType.SET_IS_AUTH_LOGIN, payload: isAuthLogin };
}

export function asyncSetIsAuthLogin(email: string, password: string) {
  return async (dispatch: AppDispatch) => {
    try {
      const data = await authApi.postLogin(email, password);
      apiHelper.putAccessToken(data.token);
      dispatch(setIsAuthLogoutActionCreator(false));
      dispatch(setIsAuthLoginActionCreator(true));
    } catch (error) {
      dispatch(setIsAuthLoginActionCreator(false));
      await showErrorDialog((error as Error).message);
    }
  };
}

// Register
export function setIsAuthRegisterActionCreator(isAuthRegister: boolean): AppAction<boolean> {
  return { type: ActionType.SET_IS_AUTH_REGISTER, payload: isAuthRegister };
}

export function asyncSetIsAuthRegister(name: string, email: string, password: string) {
  return async (dispatch: AppDispatch) => {
    try {
      const message = await authApi.postRegister(name, email, password);
      dispatch(setIsAuthRegisterActionCreator(true));
      await showSuccessDialog(message);
    } catch (error) {
      dispatch(setIsAuthRegisterActionCreator(false));
      await showErrorDialog((error as Error).message);
    }
  };
}

// Logout
export function setIsAuthLogoutActionCreator(isAuthLogout: boolean): AppAction<boolean> {
  return { type: ActionType.SET_IS_AUTH_LOGOUT, payload: isAuthLogout };
}

export function asyncSetIsAuthLogout() {
  return async (dispatch: AppDispatch) => {
    try {
      await authApi.postLogout();
    } catch {
      // Tetap hapus token secara lokal walau server gagal merespons
    } finally {
      apiHelper.putAccessToken("");
      dispatch(setIsAuthLoginActionCreator(false));
      dispatch(setIsAuthLogoutActionCreator(true));
    }
  };
}
