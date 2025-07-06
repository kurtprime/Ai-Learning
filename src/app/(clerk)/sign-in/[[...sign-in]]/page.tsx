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
