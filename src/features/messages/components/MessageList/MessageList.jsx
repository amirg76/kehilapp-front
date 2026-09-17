import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import MessagePreview from "../MessagePreview/MessagePreview";
//redux use functions
import { useSelector } from "react-redux";
//SkeletonLoading
import SkeletonLoading from "@components/ui/skeletonLoading/SkeletonLoading";
//utils
import { getCategoryImage } from "@utils/categoryImage";
import usePins from "@hooks/usePins";
// routes
import { LOGIN, REGISTER } from "@routes/routeConstants";
// redux selectors
import { selectCanSeeMembersContent } from "@store/slices/authSlice";

const MessageList = ({ messages, currentCategory, isLoading, onRemoveMessage }) => {
  //TODO - what is the best practice to get the sender's name? from where should i send the request to the backend?

  const SkeletonLoadingArray = Array.from({ length: 12 });
  const currentCategoryTitle = currentCategory?.title || "כל ההודעות";
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // Verified-but-not-yet-approved members see public content only, same as an
  // anonymous visitor — mirrors the server's canSeeMembersContent.
  const canSeeMembersContent = useSelector(selectCanSeeMembersContent);
  const isPendingApproval = isAuthenticated && !canSeeMembersContent;
  const { pinnedIds } = usePins();

  // Pinned ("important") messages float to the top; order is otherwise stable.
  const orderedMessages = useMemo(() => {
    const pinnedSet = new Set(pinnedIds);
    return [...messages].sort((a, b) => {
      const ap = pinnedSet.has(a._id) ? 1 : 0;
      const bp = pinnedSet.has(b._id) ? 1 : 0;
      return bp - ap;
    });
  }, [messages, pinnedIds]);

  // If arriving via a deep link (/messages/:categoryId#msg-:id), scroll to that
  // card once the list has rendered.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith("#msg-") || !orderedMessages.length) return;
    const el = document.getElementById(hash.slice(1));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [orderedMessages]);

  return (
    <div className="mx-auto max-w-[1410px]">
      {/* Anonymous visitors see only public posts — make the members tier visible
          and invite them to log in for the full board. Hidden once authenticated. */}
      {!isAuthenticated && (
        <div
          data-testid="anon-banner"
          className="mx-6 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
                     rounded-2xl border border-primary-200 dark:border-primary-700
                     bg-primary-50 dark:bg-primary-900/30 px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">
              🔒
            </span>
            <p className="text-primary-900 dark:text-primary-100 font-medium">
              יש תוכן נוסף לחברי הקהילה — הצטרפו או התחברו כדי לראות הכול
            </p>
          </div>
          {/* Same primary/secondary split as the header: joining is the primary
              action, logging in is the secondary one. */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to={REGISTER}
              data-testid="banner-register"
              className="text-center px-5 py-2 rounded-md bg-primary-700 hover:bg-primary-600
                         active:bg-primary-800 text-white font-medium transition-colors
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                         focus-visible:ring-offset-2 focus-visible:ring-offset-primary-50
                         dark:focus-visible:ring-offset-slate-900 dark:ring-1 dark:ring-primary-400/50"
            >
              הרשמה
            </Link>
            <Link
              to={LOGIN}
              data-testid="banner-login"
              className="text-center px-5 py-2 rounded-md border-2 border-solid border-primary-700
                         text-primary-700 font-medium hover:bg-primary-700 hover:text-white transition-colors
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                         focus-visible:ring-offset-2 focus-visible:ring-offset-primary-50
                         dark:border-primary-400 dark:text-primary-100 dark:hover:bg-primary-600
                         dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
            >
              התחברות
            </Link>
          </div>
        </div>
      )}
      {/* Signed in, verified, but not yet let in by an admin — nothing to do but
          wait, so no login/register actions here (unlike the anonymous banner).
          Amber "waiting" treatment kept distinct from the anon banner's primary
          color, and readable in both themes. */}
      {isPendingApproval && (
        <div
          data-testid="pending-approval-banner"
          role="status"
          className="mx-6 mt-6 flex items-center gap-3 rounded-2xl border border-amber-300 dark:border-amber-500/40
                     bg-amber-50 dark:bg-amber-900/20 px-5 py-4"
        >
          <span className="text-2xl" aria-hidden="true">
            ⏳
          </span>
          <p className="text-amber-900 dark:text-amber-100 font-medium">
            החשבון ממתין לאישור מנהל הקהילה — בינתיים מוצג תוכן ציבורי בלבד
          </p>
        </div>
      )}
      {/* current-category header */}
      <div className="flex items-center gap-4 px-6 pt-8 pb-2">
        <img
          src={getCategoryImage(currentCategory?.title)}
          alt={currentCategoryTitle}
          className="w-14 h-14 rounded-full object-cover border border-black border-opacity-[0.1]"
        />
        <h2 className="text-3xl font-semibold dark:text-slate-100">{currentCategoryTitle}</h2>
      </div>
      <div className="flex flex-wrap justify-center">
        {isLoading && SkeletonLoadingArray.map((_, i) => <SkeletonLoading key={i} />)}
        {orderedMessages.length ?
          orderedMessages.map((message) => (
            <MessagePreview key={message._id} message={message} onRemoveMessage={onRemoveMessage}/>
          )) :
          <div className="text-center dark:text-slate-200">
            <div className="text-2xl font-semibold">לא נמצאו הודעות </div>
            {currentCategory && <div>בקטגוריה {currentCategory.title} </div>}
          </div>
        }
      </div>
    </div>
  );
};

export default MessageList;
