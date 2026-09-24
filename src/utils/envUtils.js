import { normalizeBaseUrl } from "./baseUrl.js";

// The API base URL. The build refuses to run without a valid one (vite.config.js),
// so the throw inside normalizeBaseUrl is a second line, not the first.
//
// This used to branch on `import.meta.env.NODE_ENV === "production"` and, on that
// branch, look up an env var NAMED "https://backend.weunity.net/". Vite does not
// define NODE_ENV on import.meta.env, so the branch compiled to
// `({}).NODE_ENV === "production"` and never ran (measured in the built bundle).
// It was dead, and wrong if ever revived. There is one source now.
//
// Read with a static property access, not import.meta.env[name]: the dynamic form
// makes Vite inline the whole env object into the bundle.
export const getBaseUrl = () =>
  normalizeBaseUrl(import.meta.env.VITE_REACT_APP_BASE_URL);
