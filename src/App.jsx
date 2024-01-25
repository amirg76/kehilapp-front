import React, { useState, useEffect } from "react";
//routing
import { Routes, Route, Navigate } from "react-router-dom";
import routeConfig from "@routes/routeConfig";
// routes constants
import { ROOT, LOGIN, MESSAGES } from "@routes/routeConstants.js";
// redux
import { useDispatch, useSelector } from "react-redux";
//redux actions
import { pageLoadingActions } from "@store/slices/pageLoadingSlice";
//Header
import Header from "@components/Header/Header";
//pages
import Login from "@pages/Login";
import Messages from "@pages/Messages";
//LoadingPage
import LoadingPage from "@components/ui/LoadingPage/LoadingPage";

const App = () => {
  const user = useSelector((state) => state.user.currentUser);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const dispatch = useDispatch();
  const pageLoading = useSelector((state) => state.pageLoading.active);
  // Simulate authentication logic (replace with your actual authentication logic)
  const authenticateUser = (email, password) => {
    // Example: Check if email and password are valid
    console.log(email, password);
    const isValidCredentials =
      email === "user@example.com" && password === "password";

    // Set authentication status
    setAuthenticated(isValidCredentials);
  };

  // useEffect(() => {
  //   // Optional: Perform any additional actions on authentication status change
  //   console.log("Authentication status changed:", isAuthenticated);
  // }, [isAuthenticated]);
  useEffect(() => {
    dispatch(pageLoadingActions.toggle());
  }, []);

  return (
    <div className="w-screen flex flex-col ">
      {/* //TODO: when is logged in redirect to the corresponding page, else redirect to login page */}
      {/* {pageLoading && <LoadingPage />} */}
      {/* {isAuthenticated && <Header />} */}

      <Routes>
        {/* <Route
          path={ROOT}
          element={<Navigate to={LOGIN} />}
          exact:true
        />
        <Route
          path={LOGIN}
          element={
            isAuthenticated ? (
              <Navigate to={MESSAGES} />
            ) : (
              <Login onLogin={authenticateUser} />
            )
          }
          exact:true
        />
        <Route
          path={MESSAGES}
          element={isAuthenticated ? <Messages /> : <Navigate to={LOGIN} />}
          exact:true
        />
        <Route
          path={`${MESSAGES}/:categoryId`}
          element={isAuthenticated ? <Messages /> : <Navigate to={LOGIN} />}
          exact:true
        /> */}
        {routeConfig.map((route, index) => (
          // <Route
          //   key={index}
          //   path={route.path}
          //   element={isAuthenticated ? route.element : <Navigate to={LOGIN} />}
          //   exact={route.exact}
          // />
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
