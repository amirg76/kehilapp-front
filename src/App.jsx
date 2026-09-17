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
    const user = sessionStorage.getItem("loggedInUser");

    if (!user) return;

    dispatch(authActions.login(JSON.parse(user)));

    // The session cookie is httpOnly, so a page reload restores a session the
    // SPA cannot itself verify or refresh: sessionStorage may hold a role or an
    // `approved` flag that is now stale (an admin approval takes effect on the
    // token already held, with no re-login — see backend authController.me).
    // GET /me reads the account fresh from the auth cookie on every call, so
    // this both catches up an approval and fixes the "header shows
    // הרשמה/התחבר while a session is actually live" glitch on refresh.
    let cancelled = false;
    httpService
      .get(ME_URL)
      .then((res) => {
        if (cancelled) return;
        dispatch(authActions.updateUser(res.user));
        const stored = JSON.parse(sessionStorage.getItem("loggedInUser") || "null");
        if (stored) {
          sessionStorage.setItem(
            "loggedInUser",
            JSON.stringify({ ...stored, user: { ...stored.user, ...res.user } })
          );
        }
      })
      .catch((err) => {
        if (cancelled) return;
        // The cookie the SPA thought it had is no longer accepted by the server
        // (expired/revoked) — a session that looks signed-in locally but isn't
        // must not be left showing as authenticated.
        if (err?.response?.status === 401) {
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
