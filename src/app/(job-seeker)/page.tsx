import React from "react";
import { JobListingItems } from "./_shared/JobListingItems";

export default function page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return (
    <div className="m-4">
      <JobListingItems searchParams={searchParams} />
    </div>
  );
}
