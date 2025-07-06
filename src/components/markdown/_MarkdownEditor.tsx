"use client";

import React, { Ref } from "react";
import {
  MDXEditorProps,
  MDXEditorMethods,
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  toolbarPlugin,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ListsToggle,
  InsertThematicBreak,
  InsertTable,
} from "@mdxeditor/editor";
import { cn } from "@/lib/utils";
import useIsDarkMode from "@/hooks/useIsDarkMode";

export const markDownClassName =
  "max-w-none prose prose-neutral dark:pose-invert font-sans";

export default function InternalMarkdownEditor({
  ref,
  className,
  ...props
}: MDXEditorProps & { ref?: Ref<MDXEditorMethods> }) {
  const isDarkMode = useIsDarkMode();
  return (
    <MDXEditor
      {...props}
      className={cn(
        markDownClassName,
        isDarkMode && "dark-theme prose-invert",
        className
      )}
      suppressHtmlProcessing
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        toolbarPlugin({
          toolbarContents: () => {
            return (
              <>
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <InsertThematicBreak />
                <InsertTable />
              </>
            );
          },
        }),
      ]}
    />
  );
}
