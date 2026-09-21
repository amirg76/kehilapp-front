/**
 * Message urgency, as stored by the server on each message (`urgency`).
 *
 * The resident app only DISPLAYS this value — it is never computed or sent from
 * here. Everything below is defensive on purpose: this field was added after the
 * board already had content, so every message written before it — and anything
 * created without it — comes back as "routine" (the server default) or with the
 * key missing entirely. A card must never crash or render an empty badge because
 * of that, so an unknown, null or non-string value is normalized to "routine"
 * rather than trusted.
 */
export const URGENCY_ROUTINE = "routine";
export const URGENCY_IMPORTANT = "important";
export const URGENCY_URGENT = "urgent";

// Hebrew labels shown to residents. "routine" carries a label too, so the value
// is describable in text (tooltips, future filters) even where no badge renders.
const URGENCY_LABELS = {
  [URGENCY_ROUTINE]: "שגרה",
  [URGENCY_IMPORTANT]: "חשוב",
  [URGENCY_URGENT]: "דחוף",
};

// Sort weight, high = surfaces first. Kept as data rather than a comparator so
// the list can combine it with the pin weight without duplicating the mapping.
const URGENCY_RANK = {
  [URGENCY_ROUTINE]: 0,
  [URGENCY_IMPORTANT]: 1,
  [URGENCY_URGENT]: 2,
};

// Case/whitespace are folded before the lookup because the failure is
// asymmetric: an unrecognised "Urgent" would silently be shown as routine — the
// board would quietly hide the loudest message. Anything still unrecognised
// (including inherited keys like "toString") falls back to "routine".
export const normalizeUrgency = (value) => {
  const key = typeof value === "string" ? value.trim().toLowerCase() : value;
  return Object.prototype.hasOwnProperty.call(URGENCY_RANK, key)
    ? key
    : URGENCY_ROUTINE;
};

export const getUrgencyLabel = (value) => URGENCY_LABELS[normalizeUrgency(value)];

export const getUrgencyRank = (value) => URGENCY_RANK[normalizeUrgency(value)];
