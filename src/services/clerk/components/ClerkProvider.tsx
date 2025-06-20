"use client";

import React, { ReactNode, Suspense } from "react";
import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";
import { dark, neobrutalism, shadesOfPurple } from "@clerk/themes";
import useIsDarkMode from "@/hooks/useIsDarkMode";

export default function ClerkProvider({ children }: { children: ReactNode }) {
  const isDarkMode = useIsDarkMode();
  return (
    <Suspense>
      <OriginalClerkProvider
        appearance={isDarkMode ? { baseTheme: [shadesOfPurple] } : undefined}
      >
        {children}
      </OriginalClerkProvider>
    </Suspense>
  );
}
