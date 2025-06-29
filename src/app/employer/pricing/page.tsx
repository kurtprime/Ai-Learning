import PricingTable from "@/services/clerk/components/PricingTable";
import React from "react";

export default function page() {
  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <PricingTable />
    </div>
  );
}
