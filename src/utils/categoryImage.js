// Maps a category title to a local public image path (used for the hero banner
// and message-card cover images — NOT the sidebar, which uses the crisp SVG
// CategoryIcon).
//
// The demo backend seeds every category with `attachmentKey: 'demo/placeholder'`,
// which does not resolve to a real S3 object, so category cover images are
// resolved locally from the category title instead.
//
// Images live in `public/category-img/` and are served from `/category-img/<file>`.
// These are the original category images the app was built around.

const CATEGORY_IMAGE_MAP = {
  "חינוך": "/category-img/education.jpg",
  "בריאות": "/category-img/health.jpg",
  "קריירה": "/category-img/career.jpg",
  "תרבות": "/category-img/culture.jpg",
  "אלטרנטיבי": "/category-img/alternative.jpeg",
  "זכויות": "/category-img/right.jpg",
  "דור צעיר": "/category-img/young_generation.jpg",
};

// Shown when a category title has no explicit mapping.
const FALLBACK_CATEGORY_IMAGE = "/img/main.jpg";

/**
 * Resolve a public image path for a category by its title.
 * @param {string} [title] - The category title (e.g. "חינוך").
 * @returns {string} A `/category-img/<file>` path, falling back for unknown titles.
 */
export const getCategoryImage = (title) => {
  if (!title) return FALLBACK_CATEGORY_IMAGE;
  const key = title.trim();
  return CATEGORY_IMAGE_MAP[key] || FALLBACK_CATEGORY_IMAGE;
};

export default getCategoryImage;
