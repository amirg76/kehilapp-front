import React, { useEffect, useId, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import EditorToolbar from "./EditorToolbar";
import { editorValue, messageEditorExtensions } from "./messageEditorExtensions";

// Rich-text body of a message. Replaces react-quill (Quill 1.3.7 carried
// CVE-2021-3163 with no fixed release). Same props as before, so the form
// that uses it did not change: onChange({ name, value }) with the HTML body,
// "" when empty.
const TextareaCmp = ({ label, labelStyle, name, value, onChange, placeholder, style, children, ...otherProps }) => {
  const { containerStyle } = otherProps;
  const [linkOpen, setLinkOpen] = useState(false);
  const labelId = useId();

  // The form's change handler closes over the form state of the render that
  // created it; calling an old copy would write back a stale title/category.
  // Tiptap 3.34 already refreshes onUpdate on every render (measured
  // 20.11.2026: calling `onChange` directly here still kept the title in
  // e2e/messageEditor.spec.js). The ref keeps that true without relying on it.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  // Last value this editor reported, to tell our own echo from an outside reset.
  const emitted = useRef(value || "");

  const editor = useEditor({
    extensions: messageEditorExtensions,
    content: value || "",
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        ...(label ? { "aria-labelledby": labelId } : { "aria-label": placeholder || "תוכן ההודעה" }),
        dir: "rtl",
        class: `message-body message-editor-content min-h-[8rem] px-3 py-2 focus:outline-none ${style || ""}`,
      },
      handleKeyDown: (_view, event) => {
        // event.code, not event.key: on a Hebrew layout the K key reports "ל".
        if ((event.ctrlKey || event.metaKey) && event.code === "KeyK") {
          event.preventDefault();
          setLinkOpen(true);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: e }) => {
      const next = editorValue(e);
      emitted.current = next;
      onChangeRef.current({ name, value: next });
    },
  });

  // A value set from outside replaces the content. It counts as "from outside"
  // only when the editor had reported exactly the previous value and the form
  // then changed it. Our own updates arrive here a render late; while the
  // author keeps typing, emitted is already ahead of the previous prop, so a
  // late echo can never overwrite newer text.
  const prevValue = useRef(value || "");
  useEffect(() => {
    const next = value || "";
    const prev = prevValue.current;
    prevValue.current = next;
    if (!editor || next === prev || next === emitted.current || emitted.current !== prev) return;
    emitted.current = next;
    editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, value]);

  const isEmpty = useEditorState({ editor, selector: ({ editor: e }) => e?.isEmpty ?? true });

  return (
    <div className={`mb-10 xxs:mb-2 ${containerStyle || ""}`}>
      {label && (
        <span id={labelId} className={labelStyle}>
          {label}
        </span>
      )}
      <div className="message-editor relative rounded-md border border-gray-300 bg-white focus-within:border-primary-700">
        {editor && <EditorToolbar editor={editor} linkOpen={linkOpen} setLinkOpen={setLinkOpen} />}
        <div className="relative">
          {isEmpty && placeholder && (
            <span aria-hidden="true" className="pointer-events-none absolute right-3 top-2 text-gray-400">
              {placeholder}
            </span>
          )}
          <EditorContent editor={editor} />
        </div>
      </div>
      {children}
    </div>
  );
};

export default TextareaCmp;
