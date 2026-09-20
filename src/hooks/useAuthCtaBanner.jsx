// No default `React` import: this file is compiled with the automatic JSX
// runtime, and an unused import would add an eslint warning over the repo's
// baseline.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// WHY THIS EXISTS
// ---------------
// A signed-out visitor used to get TWO sign-up/sign-in call-to-action pairs
// above the fold at once: the pair in the header, and the pair inside the
// explanatory banner on the board ("יש תוכן נוסף לחברי הקהילה ..."). The owner
// judged that crowded, so only one may be on screen at a time.
//
// Which one had to stay was not a coin toss. The banner is the only one that
// says WHY an account is worth opening — the padlock plus the sentence about
// members-only content. A bare "הרשמה" button in the header carries no reason
// to act, so deleting the banner and keeping the header buttons would have
// removed the persuasive half and kept the decorative one. The banner stays as
// the single above-the-fold call to action, and the header pair becomes the
// fallback that takes over the moment the banner is no longer on screen — so
// the route to signing up never actually disappears, it just never doubles up.
//
// Mechanism: the banner registers its own element here, an IntersectionObserver
// reports whether it is on screen, and the header reads that flag. The default
// is "not on screen", so any page that renders no banner (or a browser with no
// IntersectionObserver) gets the header buttons immediately — this fails open,
// never into a state with no way to sign up.
const AuthCtaBannerContext = createContext({
  isBannerOnScreen: false,
  registerBanner: () => {},
});

// The sticky header is 6rem tall (h-24) and the banner slides *underneath* it
// on scroll. Without this inset the observer would still call the banner
// "visible" while it sat hidden behind the header, and the header buttons would
// stay suppressed with nothing on screen to replace them.
const HEADER_HEIGHT_PX = 96;

export const AuthCtaBannerProvider = ({ children }) => {
  const [isBannerOnScreen, setIsBannerOnScreen] = useState(false);
  const observerRef = useRef(null);

  // Ref callback rather than an effect in the banner: React calls it with the
  // node on mount and with null on unmount, which is exactly the lifecycle the
  // observer needs, and it cannot get out of step with conditional rendering.
  const registerBanner = useCallback((node) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) {
      setIsBannerOnScreen(false);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      // Older browser / test environment: leave the header buttons showing.
      setIsBannerOnScreen(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        setIsBannerOnScreen(Boolean(entry?.isIntersecting));
      },
      { threshold: 0, rootMargin: `-${HEADER_HEIGHT_PX}px 0px 0px 0px` }
    );
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  // registerBanner disconnects the previous observer only when it is called
  // again — which happens on the BANNER's lifecycle, not this Provider's. If the
  // Provider itself unmounts while a banner is still mounted (a route change
  // that swaps the tree above it, or a hot reload), that callback never runs and
  // the observer is left connected to a detached node, holding it and this
  // closure alive. Nothing else ever disconnects it, so this effect is the only
  // place the Provider's own teardown can happen. Empty deps: it must run on
  // unmount and never in between, and it reads the ref at cleanup time so it
  // always disconnects whichever observer is current then.
  useEffect(
    () => () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    },
    []
  );

  const value = useMemo(
    () => ({ isBannerOnScreen, registerBanner }),
    [isBannerOnScreen, registerBanner]
  );

  return (
    <AuthCtaBannerContext.Provider value={value}>{children}</AuthCtaBannerContext.Provider>
  );
};

// For the header: is the explanatory banner currently doing the job?
export const useIsAuthCtaBannerOnScreen = () =>
  useContext(AuthCtaBannerContext).isBannerOnScreen;

// For the banner: the ref to attach to its outermost element.
export const useAuthCtaBannerRef = () => useContext(AuthCtaBannerContext).registerBanner;
