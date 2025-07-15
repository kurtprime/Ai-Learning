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
import { markDownClassName } from "./MarkdownRenderer";

export default function InternalMarkdownEditor({
  className,
  ...props
}: MDXEditorProps) {
  const isDarkMode = useIsDarkMode();
  return (
    <MDXEditor
      {...props}
      className={cn(markDownClassName, isDarkMode && "dark-theme", className)}
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
