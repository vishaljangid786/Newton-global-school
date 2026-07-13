"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Lightweight dependency-free WYSIWYG editor for blog bodies. Edits a
 * contentEditable region and mirrors its HTML into a hidden input so the
 * existing Server Action receives `body` as HTML (sanitised server-side).
 */

interface ToolButton {
  label: string;
  title: string;
  command: string;
  value?: string;
  active?: string; // queryCommandState key
}

const TOOLS: ToolButton[][] = [
  [
    { label: "B", title: "Bold", command: "bold", active: "bold" },
    { label: "I", title: "Italic", command: "italic", active: "italic" },
    { label: "U", title: "Underline", command: "underline", active: "underline" },
  ],
  [
    { label: "H2", title: "Heading", command: "formatBlock", value: "H2" },
    { label: "H3", title: "Subheading", command: "formatBlock", value: "H3" },
    { label: "¶", title: "Paragraph", command: "formatBlock", value: "P" },
    { label: "❝", title: "Quote", command: "formatBlock", value: "BLOCKQUOTE" },
  ],
  [
    { label: "• List", title: "Bullet list", command: "insertUnorderedList" },
    { label: "1. List", title: "Numbered list", command: "insertOrderedList" },
  ],
];

export default function RichTextEditor({
  name,
  defaultValue = "",
  placeholder = "Write the post…",
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(defaultValue);
  const [isEmpty, setIsEmpty] = useState(!defaultValue);
  const id = useId();

  // Seed the editable region once on mount (uncontrolled thereafter).
  useEffect(() => {
    if (editorRef.current && defaultValue) {
      editorRef.current.innerHTML = defaultValue;
      setIsEmpty(false);
    }
  }, [defaultValue]);

  function sync() {
    const el = editorRef.current;
    if (!el) return;
    const value = el.innerHTML;
    setHtml(value);
    setIsEmpty(el.textContent?.trim().length === 0);
  }

  function exec(tool: ToolButton) {
    editorRef.current?.focus();
    document.execCommand(tool.command, false, tool.value);
    sync();
  }

  function addLink() {
    const url = prompt("Link URL (https://…):");
    if (!url) return;
    editorRef.current?.focus();
    document.execCommand("createLink", false, url);
    sync();
  }

  return (
    <div className="rounded-card border border-border bg-white transition-shadow focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-bg-alt/40 px-2 py-1.5">
        {TOOLS.map((group, gi) => (
          <div key={gi} className="flex items-center gap-1 pr-1">
            {group.map((tool) => (
              <button
                key={tool.title}
                type="button"
                title={tool.title}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => exec(tool)}
                className="min-w-8 rounded-card px-2 py-1 text-sm font-semibold text-text hover:bg-primary/10"
              >
                {tool.label}
              </button>
            ))}
            {gi < TOOLS.length - 1 ? (
              <span className="ml-1 h-5 w-px bg-border" aria-hidden="true" />
            ) : null}
          </div>
        ))}
        <span className="ml-1 h-5 w-px bg-border" aria-hidden="true" />
        <button
          type="button"
          title="Add link"
          onMouseDown={(e) => e.preventDefault()}
          onClick={addLink}
          className="rounded-card px-2 py-1 text-sm font-medium text-text hover:bg-primary/10"
        >
          🔗 Link
        </button>
        <button
          type="button"
          title="Remove formatting"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec({ label: "", title: "clear", command: "removeFormat" })}
          className="rounded-card px-2 py-1 text-xs font-medium text-text-muted hover:bg-primary/10"
        >
          Clear
        </button>
      </div>

      {/* Editable region */}
      <div className="relative">
        {isEmpty ? (
          <p className="pointer-events-none absolute left-4 top-3 text-sm text-text-muted">
            {placeholder}
          </p>
        ) : null}
        <div
          ref={editorRef}
          id={id}
          role="textbox"
          aria-multiline="true"
          aria-label="Post body"
          contentEditable
          suppressContentEditableWarning
          onInput={sync}
          onBlur={sync}
          className="admin-prose min-h-[280px] w-full px-4 py-3 text-sm leading-relaxed text-text outline-none"
        />
      </div>

      <input type="hidden" name={name} value={html} />
    </div>
  );
}
