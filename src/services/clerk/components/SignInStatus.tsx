import {
  SignedOut as ClerkSignedOut,
  SignedIn as ClerkSignedIn,
} from "@clerk/nextjs";
import React, { ReactNode, Suspense } from "react";

export function SignedOut({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <ClerkSignedOut>{children}</ClerkSignedOut>
    </Suspense>
  );
}

export function SignedIn({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <ClerkSignedIn>{children}</ClerkSignedIn>
    </Suspense>
  );
}
