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

const App = () => {
  const { pathname } = useLocation(); //* temp fix for hiding header on login screen
  const dispatch = useDispatch();
  //
  useEffect(() => {
    // const token = localStorage.getItem("token");
    const user = sessionStorage.getItem("loggedInUser");

    if (user) {
      dispatch(authActions.login(JSON.parse(user)));
    }
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
