import { useCallback, useEffect, useState } from "react";
import { getPinnedIds, togglePin, subscribePins } from "@utils/pins";

// React binding over the localStorage pin store. Returns the current pinned ids
// and a toggle; every hook instance re-renders when any card changes a pin.
const usePins = () => {
  const [pinnedIds, setPinnedIds] = useState(getPinnedIds);

  useEffect(() => {
    const sync = () => setPinnedIds(getPinnedIds());
    // Re-sync on mount in case localStorage changed before the listener attached.
    sync();
    return subscribePins(sync);
  }, []);

  const toggle = useCallback((id) => {
    togglePin(id);
  }, []);

  return { pinnedIds, isPinned: (id) => pinnedIds.includes(id), toggle };
};

export default usePins;
