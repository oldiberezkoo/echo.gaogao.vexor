"use client";

import { Provider as JotaiProvider } from "jotai";
import { PropsWithChildren } from "react";
import { TMAProvider } from "./tma-provider";

export function RootProvider({ children }: PropsWithChildren) {
  return (
    <JotaiProvider>
      <TMAProvider>{children}</TMAProvider>
    </JotaiProvider>
  );
}
