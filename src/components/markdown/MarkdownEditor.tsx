import dynamic from "next/dynamic";
import React from "react";

export const MarkDownEditor = dynamic(() => import("./_MarkdownEditor"), {
  ssr: false,
});
