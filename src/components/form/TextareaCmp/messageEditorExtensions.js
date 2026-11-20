import StarterKit from "@tiptap/starter-kit";
import { safeHttpUrl } from "@utils/urlSafety";

// The editor may only produce what the message display keeps. TextPreview runs
// every body through DOMPurify with a fixed tag list; a toolbar button whose
// output is stripped there is a button that lies to the author. That is what
// the old Quill toolbar did with fonts, sizes, colours, alignment, images and
// video. So: no code, code blocks or horizontal rules, headings 2 and 3 only.
//
// Output tags: p, br, strong, em, u, s, h2, h3, ul, ol, li, blockquote, a.
// TextPreview's ALLOWED_TAGS must contain every one of them.
export const messageEditorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    horizontalRule: false,
    link: {
      // Typing or pasting an address turns it into a link, as Quill's
      // magic-url module did. Clicking a link inside the editor does not
      // navigate away from a half-written message; links are edited with the
      // link button or Ctrl+K.
      autolink: true,
      linkOnPaste: true,
      openOnClick: false,
      defaultProtocol: "https",
      // Same rule as the display: http(s) only, no control or bidi
      // characters. Anything else stays plain text.
      isAllowedUri: (url) => safeHttpUrl(url) !== null,
      shouldAutoLink: (url) => safeHttpUrl(url) !== null,
      // Keep the stored HTML to a bare href. The display drops every other
      // attribute anyway.
      HTMLAttributes: { target: null, rel: null, class: null },
    },
  }),
];

/**
 * The stored value for an editor: "" when there is nothing to send. Empty
 * paragraphs at the very start or end (a trailing Enter, or the one a pasted
 * block leaves behind, measured 20.11.2026) are dropped; they show as nothing
 * and only eat into the 1500-character limit.
 */
export const editorValue = (editor) =>
  editor.isEmpty ? "" : editor.getHTML().replace(/^(?:<p><\/p>)+|(?:<p><\/p>)+$/g, "");
