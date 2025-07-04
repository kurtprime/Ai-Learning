export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { SignIn } from "@clerk/nextjs";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  return <SignIn />;
}
