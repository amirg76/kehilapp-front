// Per-browser "important" pins for messages. This is a viewer convenience, not
// server state: it lives only in localStorage and works for anonymous visitors
// too. A tiny pub/sub lets every mounted card re-render the moment a pin toggles.
const STORAGE_KEY = "kehilapp:pinnedMessages";
const EVENT = "kehilapp:pins-changed";

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function write(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore storage failures (private mode, quota) */
  }
  // Notify same-tab listeners (the native `storage` event only fires cross-tab).
  try {
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {
    /* ignore */
  }
}

export function getPinnedIds() {
  return read();
}

export function isPinned(id) {
  return read().includes(id);
}

export function togglePin(id) {
  const ids = read();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  write(next);
  return next.includes(id);
}

// Subscribe to pin changes (same tab via CustomEvent, other tabs via `storage`).
export function subscribePins(listener) {
  const onStorage = (e) => {
    if (e.key === STORAGE_KEY) listener();
  };
  window.addEventListener(EVENT, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, listener);
    window.removeEventListener("storage", onStorage);
  };
}
