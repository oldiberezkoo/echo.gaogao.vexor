"use client";

import { initViewEditModeStore } from "@/features/viewEditMode/storage/localforage";
import { Provider as JotaiProvider } from "jotai";
import { PropsWithChildren } from "react";
import { TMAProvider } from "./tma-provider";

export function RootProvider({ children }: PropsWithChildren) {
  initViewEditModeStore();
  return (
    <JotaiProvider>
      <TMAProvider>{children}</TMAProvider>
    </JotaiProvider>
  );
}
