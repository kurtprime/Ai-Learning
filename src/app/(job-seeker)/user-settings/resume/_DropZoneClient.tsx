"use client";
import { UploadDropZone } from "@/services/uploadthing/components/UploadThing";
import { useRouter } from "next/navigation";

export default function DropZoneClient() {
  const router = useRouter();
  return (
    <UploadDropZone
      endpoint="resumeUploader"
      onClientUploadComplete={() => router.refresh()}
    />
  );
}
