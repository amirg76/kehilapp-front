// Plain absolute paths. These previously came from currentEndPointHelper(), which
// derived the route prefix from the URL's first segment — a deploy-under-subpath
// hack that broke category navigation at the site root (links resolved to
// /messages instead of /messages/:categoryId). Standard paths just work.
export const ROOT = "/";
export const LOGIN = "/login";
export const REGISTER = "/register";
export const VERIFY_EMAIL = "/verify-email";
export const MESSAGES = "/messages";
