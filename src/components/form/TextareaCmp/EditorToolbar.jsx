import React, { useEffect, useRef, useState } from "react";
import { useEditorState } from "@tiptap/react";
import {
  MdFormatBold,
  MdFormatClear,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdFormatUnderlined,
  MdLink,
  MdRedo,
  MdStrikethroughS,
  MdUndo,
} from "react-icons/md";
import { LuHeading2, LuHeading3 } from "react-icons/lu";
import { safeHttpUrl } from "@utils/urlSafety";

// One button. aria-pressed tells a screen reader whether the format is on;
// title gives the sighted user the same name plus the keyboard shortcut.
// `active` is passed only for on/off formats; plain actions (clear, undo, redo)
// are not toggle buttons and get no aria-pressed.
const ToolButton = ({ label, shortcut, icon: Icon, onClick, active, disabled = false, mirror = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    aria-pressed={active === undefined ? undefined : active}
    title={shortcut ? `${label} (${shortcut})` : label}
    // Keep the editor's selection: a mousedown on a button would otherwise
    // move focus out of the text and the command would hit nothing.
    onMouseDown={(e) => e.preventDefault()}
    className={`flex h-9 w-9 items-center justify-center rounded-md text-xl transition-colors
      focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-700
      disabled:cursor-not-allowed disabled:opacity-40
      ${active ? "bg-primary-100 text-primary-800" : "text-gray-700 hover:bg-gray-100"}`}
  >
    <Icon aria-hidden="true" className={mirror ? "-scale-x-100" : undefined} />
  </button>
);

const Divider = () => <span aria-hidden="true" className="mx-1 h-6 w-px self-center bg-gray-300" />;

// Inline panel for adding, editing or removing a link. Replaces a browser
// prompt(): it can show an error, keeps the author's selection, and works the
// same on a phone.
const LinkPanel = ({ editor, initialHref, onClose }) => {
  const [href, setHref] = useState(initialHref);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => inputRef.current?.focus(), []);

  const apply = () => {
    const safe = safeHttpUrl(href.trim());
    if (!safe) {
      setError("כתובת לא תקינה. אפשר להוסיף רק כתובת אתר שמתחילה ב-http, ב-https או ב-www.");
      return;
    }
    const chain = editor.chain().focus();
    if (editor.state.selection.empty && !editor.isActive("link")) {
      // Nothing selected: the address itself becomes the link text.
      chain.insertContent({ type: "text", text: href.trim(), marks: [{ type: "link", attrs: { href: safe } }] }).run();
    } else {
      chain.extendMarkRange("link").setLink({ href: safe }).run();
    }
    onClose();
  };

  const remove = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    onClose();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 bg-gray-50 px-2 py-2">
      <label htmlFor="message-editor-link" className="text-sm text-gray-700">
        כתובת הקישור
      </label>
      <input
        id="message-editor-link"
        ref={inputRef}
        // type="text", not "url": this input sits inside the message <form>,
        // and a type=url value like "www.example.com" fails the browser's own
        // check, which silently blocked "שלח" while the panel was open.
        type="text"
        dir="ltr"
        inputMode="url"
        value={href}
        placeholder="https://"
        onChange={(e) => {
          setHref(e.target.value);
          setError("");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            apply();
          } else if (e.key === "Escape") {
            e.preventDefault();
            onClose();
            editor.commands.focus();
          }
        }}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "message-editor-link-error" : undefined}
        className="min-w-0 flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-primary-700 focus:outline-none"
      />
      <button type="button" onClick={apply} className="rounded-md bg-primary-700 px-3 py-1 text-sm text-white hover:bg-primary-800">
        {editor.isActive("link") ? "עדכון" : "הוספה"}
      </button>
      {editor.isActive("link") && (
        <button type="button" onClick={remove} className="rounded-md px-3 py-1 text-sm text-red-700 hover:bg-red-50">
          הסרת קישור
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          onClose();
          editor.commands.focus();
        }}
        className="rounded-md px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
      >
        ביטול
      </button>
      {error && (
        <p id="message-editor-link-error" role="alert" className="w-full text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
};

const EditorToolbar = ({ editor, linkOpen, setLinkOpen }) => {
  // Tiptap 3 does not re-render on every keystroke; this hook re-renders the
  // toolbar only when one of these values changes.
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      link: e.isActive("link"),
      href: e.getAttributes("link").href || "",
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });

  const run = (fn) => () => fn(editor.chain().focus()).run();

  return (
    <>
      <div role="toolbar" aria-label="עיצוב טקסט" className="flex flex-wrap items-center gap-0.5 border-b border-gray-200 px-1 py-1">
        <ToolButton label="מודגש" shortcut="Ctrl+B" icon={MdFormatBold} active={s.bold} onClick={run((c) => c.toggleBold())} />
        <ToolButton label="נטוי" shortcut="Ctrl+I" icon={MdFormatItalic} active={s.italic} onClick={run((c) => c.toggleItalic())} />
        <ToolButton label="קו תחתון" shortcut="Ctrl+U" icon={MdFormatUnderlined} active={s.underline} onClick={run((c) => c.toggleUnderline())} />
        <ToolButton label="קו חוצה" shortcut="Ctrl+Shift+S" icon={MdStrikethroughS} active={s.strike} onClick={run((c) => c.toggleStrike())} />
        <Divider />
        <ToolButton label="כותרת" shortcut="Ctrl+Alt+2" icon={LuHeading2} active={s.h2} onClick={run((c) => c.toggleHeading({ level: 2 }))} />
        <ToolButton label="כותרת משנה" shortcut="Ctrl+Alt+3" icon={LuHeading3} active={s.h3} onClick={run((c) => c.toggleHeading({ level: 3 }))} />
        <Divider />
        <ToolButton label="רשימת תבליטים" shortcut="Ctrl+Shift+8" icon={MdFormatListBulleted} mirror active={s.bullet} onClick={run((c) => c.toggleBulletList())} />
        <ToolButton label="רשימה ממוספרת" shortcut="Ctrl+Shift+7" icon={MdFormatListNumbered} mirror active={s.ordered} onClick={run((c) => c.toggleOrderedList())} />
        <ToolButton label="ציטוט" shortcut="Ctrl+Shift+B" icon={MdFormatQuote} active={s.quote} onClick={run((c) => c.toggleBlockquote())} />
        <Divider />
        <ToolButton label="קישור" shortcut="Ctrl+K" icon={MdLink} active={s.link || linkOpen} onClick={() => setLinkOpen(!linkOpen)} />
        <ToolButton label="ניקוי עיצוב" icon={MdFormatClear} onClick={run((c) => c.unsetAllMarks().clearNodes())} />
        <Divider />
        <ToolButton label="ביטול פעולה" shortcut="Ctrl+Z" icon={MdUndo} mirror disabled={!s.canUndo} onClick={run((c) => c.undo())} />
        <ToolButton label="ביצוע שוב" shortcut="Ctrl+Y" icon={MdRedo} mirror disabled={!s.canRedo} onClick={run((c) => c.redo())} />
      </div>
      {linkOpen && <LinkPanel key={s.href} editor={editor} initialHref={s.href} onClose={() => setLinkOpen(false)} />}
    </>
  );
};

export default EditorToolbar;
