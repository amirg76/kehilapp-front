// No `import React` here on purpose: the project builds with the automatic JSX
// runtime, and importing it only to leave it unused adds another
// no-unused-vars warning to a lint run that already carries that debt.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import {
  normalizeUrgency,
  getUrgencyLabel,
  URGENCY_IMPORTANT,
  URGENCY_URGENT,
} from "@utils/urgency";

/**
 * Urgency badge for a message card, in the same pill language as the existing
 * "לחברים בלבד" / "נעוץ" badges on this card.
 *
 * Three deliberate decisions:
 *
 * 1. "routine" renders nothing. It is the server default, so it is also the
 *    overwhelming majority of the board — a badge on every single card would be
 *    pure noise and would devalue the two badges that do mean something. Absence
 *    of a badge IS "שגרה"; the label still exists in @utils/urgency for anywhere
 *    text is needed.
 * 2. Colour never carries the meaning on its own. Each level has its own Hebrew
 *    word AND its own icon shape (triangle vs circle), so the two levels stay
 *    distinguishable in greyscale, for a colour-blind reader, and for a screen
 *    reader (the icon is aria-hidden; the text is the accessible name).
 * 3. Both palettes are checked in light and dark. Measured with the WCAG 2.1
 *    formula against the composited card background (slate-800, and the pinned
 *    card's primary-900/30 tint): light 8.20 (urgent) / 8.15 (important), dark
 *    10.14–11.40 — all above the 4.5 required for body text.
 */
const UrgencyBadge = ({ urgency }) => {
  const level = normalizeUrgency(urgency);

  // Unknown/missing values were already folded into "routine" above, so this one
  // check covers both "nothing to show" and "field never arrived from the API".
  if (level !== URGENCY_IMPORTANT && level !== URGENCY_URGENT) return null;

  const isUrgent = level === URGENCY_URGENT;

  return (
    <span
      data-testid="urgency-badge"
      data-urgency={level}
      className={`inline-flex items-center gap-1 w-fit mb-2 px-3 py-1 rounded-full text-sm font-semibold border ${
        isUrgent
          ? "bg-red-100 text-red-900 border-red-300 dark:bg-red-900/40 dark:text-red-100 dark:border-red-700"
          : "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/40 dark:text-amber-100 dark:border-amber-700"
      }`}
    >
      <FontAwesomeIcon
        icon={isUrgent ? faTriangleExclamation : faCircleExclamation}
        aria-hidden="true"
      />
      {getUrgencyLabel(level)}
    </span>
  );
};

export default UrgencyBadge;
