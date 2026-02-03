import type { BlockLabel } from "@/entities/block";
import { DEFAULT_BLOCKS } from "@/shared/constants/mock-data";
import { atom } from "jotai";

export const blocksAtom = atom<BlockLabel[]>(DEFAULT_BLOCKS);
