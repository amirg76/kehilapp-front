import React, { useEffect } from "react";
//routing
import { Routes, Route, useLocation } from "react-router-dom";
import routeConfig from "@routes/routeConfig";
// routes constants
import { LOGIN, REGISTER, VERIFY_EMAIL } from "@routes/routeConstants.js";
// redux
import { authActions } from "@store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
//components
import Header from "@components/Header/Header";
// api
import { ME_URL } from "@api/apiConstants";
import { httpService } from "@/services/httpService";

const App = () => {
  const { pathname } = useLocation(); //* temp fix for hiding header on login screen
  const dispatch = useDispatch();
  //
  useEffect(() => {
    // const token = localStorage.getItem("token");
    const storedRaw = sessionStorage.getItem("loggedInUser");
    const stored = storedRaw ? JSON.parse(storedRaw) : null;

    if (stored) {
      dispatch(authActions.login(stored));
    }

    // The session cookie is httpOnly, so the SPA cannot verify or refresh a
    // session on its own by reading local state. sessionStorage is per-tab and
    // httpService clears it on any 401, so the case this exists to fix is
    // exactly a live cookie with EMPTY sessionStorage — a fresh tab, or one
    // that got cleared — where the header would otherwise keep showing
    // הרשמה/התחבר while a session is actually live. That case only gets fixed
    // if GET /me runs regardless of what sessionStorage holds, so it always
    // runs here. A 401 is the normal, quiet answer for a genuine anonymous
    // visitor (no cookie sent), so this adds no noise or delay to that path.
    let cancelled = false;
    httpService
      .get(ME_URL)
      .then((res) => {
        if (cancelled) return;
        // Guard the shape before merging: a proxy returning HTML, `{ user: null
        // }`, or an array would otherwise spread into a silent no-op
        // indistinguishable from a real merge. Anything that doesn't look like
        // a real user is treated the same as an unknown failure below.
        const user = res && res.user;
        const isValidUser =
          user &&
          typeof user === "object" &&
          !Array.isArray(user) &&
          typeof user.id === "string" &&
          typeof user.email === "string";
        if (!isValidUser) {
          console.error(
            "GET /api/auth/me returned an unexpected shape — treating as signed-out",
            res
          );
          sessionStorage.removeItem("loggedInUser");
          dispatch(authActions.logout());
          return;
        }
        if (stored) {
          dispatch(authActions.updateUser(user));
          sessionStorage.setItem(
            "loggedInUser",
            JSON.stringify({ ...stored, user: { ...stored.user, ...user } })
          );
        } else {
          // No local session existed — this is the live-cookie/empty-storage
          // case this effect exists to fix. `token`/`csrfToken` are never read
          // back out of this stored object (CSRF is read straight off its own
          // cookie — see httpService); only `.user` is, so a user-only shape
          // is enough to bring the UI in sync with the cookie the server just
          // confirmed.
          dispatch(authActions.login({ user }));
          sessionStorage.setItem("loggedInUser", JSON.stringify({ user }));
        }
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.response?.status === 401) {
          // The cookie the SPA thought it had is no longer accepted by the
          // server (expired/revoked), or there never was one (anonymous
          // visitor) — either way, a session that looks signed-in locally but
          // isn't must not be left showing as authenticated.
          sessionStorage.removeItem("loggedInUser");
          dispatch(authActions.logout());
          return;
        }
        // Any other failure (network drop, 500, the 429 rate limiter, ...)
        // means the account's current permission is genuinely unknown — and
        // "unknown" must not be left rendering as "still approved". Log it
        // (a real failure, not something to swallow) and fail closed rather
        // than leave a possibly-stale approved state standing.
        console.error("GET /api/auth/me failed (not a 401) — signing out locally", err);
        if (stored) {
          sessionStorage.removeItem("loggedInUser");
          dispatch(authActions.logout());
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);
  // The auth screens (login/register/verify) render full-bleed without the app
  // chrome, matching the existing login layout.
  const hideHeaderOn = [LOGIN, REGISTER, VERIFY_EMAIL];
  return (
    <div className="w-screen flex flex-col bg-white dark:bg-slate-900 min-h-screen">
      {/* //TODO: when is logged in redirect to the corresponding page, else redirect to login page */}

      {/* //TODO: when logged out, disable Header component */}
      {/* {isAuthenticated && <Header />} */}
      {!hideHeaderOn.includes(pathname) && <Header />}
      {/*

        <Route
          path={MESSAGES}
          element={isAuthenticated ? <Messages /> : <Navigate to={LOGIN} />}
          exact:true
          />
        */}

      <main className="flex flex-col flex-1">
        <Routes>
          {routeConfig.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
              exact={route.exact}
            />
          ))}
        </Routes>
      </main>
    </div>
  );
};

export default App;
