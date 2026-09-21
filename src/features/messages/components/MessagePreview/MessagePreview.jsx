import React, { useEffect, useRef, useState } from "react";
//components
import Avatar from "@components/ui/Avatar/Avatar";
import CategoryTag from "../CategoryTag/CategoryTag";
import UrgencyBadge from "../UrgencyBadge/UrgencyBadge";
import TextPreview from "../TextPreview/TextPreview";
import FilePreview from "../FilePreview/FilePreview";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

import { useSelector } from "react-redux";

//utils
import useFormattedDate from "../../../../hooks/useFormattedDate";
import usePins from "@hooks/usePins";
import { highlightText } from "@utils/highlight";
// Bidi controls come off every piece of author-supplied text this card shows.
// See src/utils/bidiText.js for what they are and why this strips rather than
// refuses. The body is handled one layer down, at the text-node hook in
// src/utils/linkify.jsx, because it is HTML and must not be rewritten as a
// string; everything this file renders is plain text and is cleaned here.
import { labelText, stripBidiControls } from "@utils/bidiText";

const MessagePreview = ({ message, onRemoveMessage }) => {
  const [isLongTextShown, setIsLongTextShown] = useState(false);
  const contentRef = useRef();
  const [containerHeight, setContainerHeight] = useState(0);
  const [shareToast, setShareToast] = useState("");
  const formattedDate = useFormattedDate(message.createdAt);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const searchTerm = useSelector((state) => state.message.searchTerm);

  const { isPinned, toggle } = usePins();
  const pinned = isPinned(message._id);

  // Members-only content tier: prefer the API's `visibility` field ('members'),
  // fall back to the demo text marker if the field isn't present.
  const isMembersOnly =
    message.visibility === "members" ||
    (typeof message.text === "string" && message.text.includes("לחברים בלבד"));

  useEffect(() => {
    if (contentRef.current) {
      setContainerHeight(contentRef.current.offsetHeight - 50);
    }
  }, [isLongTextShown, contentRef?.current?.offsetHeight]);

  const toggleLongText = () => {
    if (isLongTextShown) setIsLongTextShown(false);
    else setIsLongTextShown(true);
  };

  // Deep link to this specific message: /messages/:categoryId#msg-:id. The
  // anchor lets the list scroll straight to the card on load (see MessageList).
  const buildShareUrl = () => {
    const categoryId = message.category?._id || "";
    return `${window.location.origin}/messages/${categoryId}#msg-${message._id}`;
  };

  const showToast = (text) => {
    setShareToast(text);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setShareToast(""), 2000);
  };

  const onShare = async () => {
    const url = buildShareUrl();
    // The share sheet hands this title to another application entirely — a
    // messaging app, a mail client — which will render it with no idea where it
    // came from and, on a Hebrew phone, with the same RTL default that hides
    // the reversal here. Clean it on the way out. labelText, not plain
    // stripBidiControls: this is a one-line label in somebody else's UI, so
    // collapsing whitespace is right here even though it is wrong for the <h1>.
    const shareData = { title: labelText(message.title) || "Kehilapp", url };
    // Prefer the native share sheet on mobile; fall back to clipboard copy.
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* user cancelled or share failed — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast("הועתק!");
    } catch {
      showToast("העתקה נכשלה");
    }
  };

  return (
    <div
      id={`msg-${message._id}`}
      data-testid="message-card"
      className={`w-[436px] max-sm:w-full border-solid border rounded-[30px] mx-4 my-10
            ${
              pinned
                ? "border-primary-400 dark:border-primary-500 bg-primary-50 dark:bg-primary-900/30 ring-1 ring-primary-300/60 dark:ring-primary-600/40"
                : "border-black border-opacity-[0.2] dark:border-white/10 bg-white dark:bg-slate-800"
            }`}
      style={{
        height: `${containerHeight}px`,
        position: "relative",
        zIndex: "1",
      }}
    >
      {/* pinned badge */}
      {pinned && (
        <span
          className="absolute top-3 right-3 z-[2] inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-xs font-semibold
                     bg-primary-100 text-primary-800 border border-primary-300
                     dark:bg-primary-900/50 dark:text-primary-200 dark:border-primary-700"
        >
          📌 נעוץ
        </span>
      )}
      <div
        className="flex flex-col p-[15px] relative bottom-[50px]"
        ref={contentRef}
      >
        {/* The attachment name is author-supplied and reaches the DOM twice in
            DocumentPreview: as the visible (CSS-truncated) caption, and as the
            `download` attribute of the anchor it builds — which becomes the name
            of a file on the reader's disk. "invoice<RLO>gnp.exe" reads as
            "invoiceexe.png" in both places. Cleaned here, at the only caller of
            FilePreview, so the prop is already safe wherever it is used.
            labelText because that caption is a single truncated line. */}
        <FilePreview
          attachmentType={message.attachmentType}
          attachmentUrl={
            message.attachmentUrl
              ? message.attachmentUrl
              : message.category.coverImgUrl
          }
          attachmentName={labelText(message.attachmentName)}
        />

        <div className="flex flex-col flex-1 mt-[10px]">
          {/* Urgency sits above the access badge and the title: it is the first
              thing that should change how the reader treats the card, while
              "לחברים בלבד" answers a different question (who may see it).
              Each badge keeps its own row so two badges wrap instead of
              overflowing the card on a narrow phone. */}
          <UrgencyBadge urgency={message.urgency} />
          {isMembersOnly && (
            <span
              className="inline-flex items-center gap-1 w-fit mb-2 px-3 py-1 rounded-full text-sm font-semibold
                         bg-primary-100 text-primary-800 border border-primary-300
                         dark:bg-primary-900/40 dark:text-primary-200 dark:border-primary-700"
            >
              🔒 לחברים בלבד
            </span>
          )}
          <h1 className="text-[20px] font-semibold mb-[2px] dark:text-slate-100">
            {/* Strip BEFORE highlighting, not after: highlightText splits the
                string on the search term and returns React nodes, so a later
                pass would have to walk an array of nodes instead of a string,
                and a control sitting inside a match would be missed entirely.
                stripBidiControls, not labelText — the heading may legitimately
                wrap, and collapsing its whitespace would change how a title
                the author spaced out is laid out. */}
            {highlightText(stripBidiControls(message.title), searchTerm)}
          </h1>
          <TextPreview
            txt={message.text}
            isLongTxtShown={isLongTextShown}
            toggleLongText={toggleLongText}
            baseClasses="text-preview"
            expandedClasses="text-preview expanded"
            searchTerm={searchTerm}
          />
          <section className="flex items-center">
            <Avatar classes="ml-[17px]" />
            <h6 className="w-fit dark:text-slate-200">
              {/* The sender name is author-supplied too — typed at registration
                  rather than with the message, but it renders on this card, next
                  to this message, and an override left open in a first name
                  flips the direction of the date and the badges drawn after it.
                  Same treatment, same reason. The `||` fallbacks stay on the
                  OUTSIDE of the strip so a name made only of controls becomes ""
                  and falls back to the default, instead of rendering blank. */}
              <span className="font-semibold text-[18px]">
                {labelText(message.sender.firstName) || "קיבוץ"}{" "}
                {labelText(message.sender.lastName) || "כיסופים"}
              </span>
            </h6>
          </section>
          <div className="flex items-end justify-between">
            <section className="flex items-center w-fit dark:text-slate-300">
              <h6 className="ml-[15px]">{formattedDate.date}</h6>
              <h6 className="font-light ml-[15px]">{formattedDate.time}</h6>
            </section>
            <div className="flex items-center gap-2 relative">
              {/* pin / important toggle — per-browser, works for anonymous viewers */}
              <button
                type="button"
                onClick={() => toggle(message._id)}
                aria-pressed={pinned}
                aria-label={pinned ? "בטל נעיצה" : "סמן כחשוב"}
                title={pinned ? "בטל נעיצה" : "סמן כחשוב"}
                className={`p-2 rounded-full transition-colors ${
                  pinned
                    ? "text-primary-600 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/40"
                    : "text-slate-500 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:text-primary-600"
                }`}
              >
                <FontAwesomeIcon icon={pinned ? faStarSolid : faStarRegular} />
              </button>
              {/* share — Web Share API on mobile, clipboard copy otherwise */}
              <button
                type="button"
                onClick={onShare}
                aria-label="שיתוף ההודעה"
                title="שיתוף"
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-primary-600 transition-colors"
              >
                <FontAwesomeIcon icon={faShareNodes} />
              </button>
              {isAuthenticated && (
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => onRemoveMessage(message._id)}
                  className="cursor-pointer p-2 rounded-full bg-slate-200 dark:bg-slate-700 dark:text-slate-300 hover:text-gray-600"
                />
              )}
              {shareToast && (
                <span
                  role="status"
                  className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-md text-sm font-medium
                             bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-lg"
                >
                  {shareToast}
                </span>
              )}
            </div>
            <CategoryTag
              category={{
                title: message.category.title,
                color: message.category.categoryColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePreview;
