import dynamic from "next/dynamic";

export const MarkDownEditor = dynamic(() => import("./_MarkdownEditor"), {
  ssr: false,
});
