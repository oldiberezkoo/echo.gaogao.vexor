import { atom } from "jotai";

export const isAuthorizedAtom = atom<boolean>(false);
export const initDataAtom = atom<any | null>(null);
export const userAtom = atom((get) => get(initDataAtom)?.user || null);
export const startParamAtom = atom(
  (get) => get(initDataAtom)?.startParam || null
);
