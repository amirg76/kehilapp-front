import React, { useEffect } from "react";
//routing
import { Routes, Route, useLocation } from "react-router-dom";
import routeConfig from "@routes/routeConfig";
// routes constants
import { LOGIN } from "@routes/routeConstants.js";
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
  return (
    <div className="w-screen flex flex-col ">
      {/* //TODO: when is logged in redirect to the corresponding page, else redirect to login page */}

      {/* //TODO: when logged out, disable Header component */}
      {/* {isAuthenticated && <Header />} */}
      {pathname !== LOGIN && <Header />}
      {/*

        <Route
          path={MESSAGES}
          element={isAuthenticated ? <Messages /> : <Navigate to={LOGIN} />}
          exact:true
          />
        */}

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
    </div>
  );
};

export default App;
