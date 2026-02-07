import { ViewEditMode } from "@/entities/viewEditMode";
import { DEVELOPMENT_MODE, PDF_SOURCE_DOMAIN } from "@/shared/constants";
import localforage from "localforage";
import { decodeFromBase58, encodeToBase58 } from "../base58";

const VIEW_EDIT_MODE_KEY = "viewEditMode";

export const vexorStorage = localforage.createInstance({
  name: PDF_SOURCE_DOMAIN,
  storeName: PDF_SOURCE_DOMAIN,
  driver: localforage.LOCALSTORAGE,
});

export const viewEditModeStore = {
  async get(): Promise<ViewEditMode | null> {
    const stored = await vexorStorage.getItem<string>(VIEW_EDIT_MODE_KEY);
    if (!stored) return null;

    if (DEVELOPMENT_MODE) {
      try {
        return JSON.parse(stored) as ViewEditMode;
      } catch {
        await this.remove();
        return null;
      }
    } else {
      try {
        return decodeFromBase58<ViewEditMode>(stored);
      } catch {
        await this.remove();
        return null;
      }
    }
  },

  async set(value: ViewEditMode): Promise<void> {
    if (DEVELOPMENT_MODE) {
      await vexorStorage.setItem(VIEW_EDIT_MODE_KEY, JSON.stringify(value));
    } else {
      const encoded = encodeToBase58(value);
      await vexorStorage.setItem(VIEW_EDIT_MODE_KEY, encoded);
    }
  },

  async update(
    patch: Partial<Omit<ViewEditMode, "updatedAt">>,
  ): Promise<ViewEditMode> {
    const current = await this.get();

    const next: ViewEditMode = {
      userId: current?.userId ?? null,
      userRole: current?.userRole ?? null,
      viewModeEdit: current?.viewModeEdit ?? false,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    await this.set(next);
    return next;
  },

  async remove(): Promise<void> {
    await vexorStorage.removeItem(VIEW_EDIT_MODE_KEY);
  },

  async clear(): Promise<void> {
    await vexorStorage.clear();
  },
};

export async function initViewEditModeStore(): Promise<ViewEditMode> {
  const existing = await viewEditModeStore.get();

  if (existing) {
    return existing;
  }

  const initial: ViewEditMode = {
    userId: null,
    userRole: null,
    viewModeEdit: false,
    updatedAt: new Date().toISOString(),
  };

  await viewEditModeStore.set(initial);
  return initial;
}
