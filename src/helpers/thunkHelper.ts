import type { AppAction } from "@/types/action";
import { showErrorDialog, showSuccessDialog } from "./toolsHelper";

type Dispatcher = (action: AppAction) => unknown;
type FlagCreator = (value: boolean) => AppAction;

interface MutationOptions {
  setStart: FlagCreator;
  setDone?: FlagCreator;
  run: () => Promise<unknown>;
  showSuccess?: boolean;
}

/**
 * Membuat thunk untuk aksi mutasi (tambah/ubah/hapus).
 * - setStart(value): menandai proses sedang berjalan
 * - setDone(value): (opsional) menandai hasil proses (berhasil / gagal)
 * - run(): fungsi async yang memanggil API dan mengembalikan pesan
 * Thunk mengembalikan true bila berhasil dan false bila gagal.
 */
export function createMutationThunk({
  setStart,
  setDone,
  run,
  showSuccess = true,
}: MutationOptions) {
  return async (dispatch: Dispatcher): Promise<boolean> => {
    const markDone = (value: boolean) => {
      if (setDone) {
        dispatch(setDone(value));
      }
    };
    dispatch(setStart(true));
    markDone(false);
    try {
      const message = await run();
      markDone(true);
      if (showSuccess) {
        await showSuccessDialog(String(message));
      }
      return true;
    } catch (error) {
      markDone(false);
      await showErrorDialog((error as Error).message);
      return false;
    } finally {
      dispatch(setStart(false));
    }
  };
}

/**
 * Membuat reducer sederhana untuk flag boolean dari satu action type.
 */
export function createFlagReducer(type: string, initialValue = false) {
  return (state: boolean = initialValue, action: AppAction = { type: "" }) =>
    action.type === type ? (action.payload as boolean) : state;
}

export const flagActionCreator =
  (type: string): FlagCreator =>
  (value: boolean) => ({ type, payload: value });
