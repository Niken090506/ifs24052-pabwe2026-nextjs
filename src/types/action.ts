/** Bentuk umum action Redux yang dipakai di seluruh fitur. */
export interface AppAction<T = unknown> {
  type: string;
  payload?: T;
}
