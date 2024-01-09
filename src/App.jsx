import React, { useState, useEffect } from "react";
//routing
import { Routes, Route } from "react-router-dom";
import routeConfig from "@routes/routeConfig";
import Header from "@components/Header/Header";
import { ROOT, LOGIN } from "@routes/routeConstants.js";
import Login from "@pages/Login";
import { Navigate } from "react-router-dom";

const App = () => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  // Simulate authentication logic (replace with your actual authentication logic)
  const authenticateUser = (email, password) => {
    // Example: Check if email and password are valid
    console.log(email, password);
    const isValidCredentials =
      email === "user@example.com" && password === "password";

    // Set authentication status
    setAuthenticated(isValidCredentials);
  };

  useEffect(() => {
    // Optional: Perform any additional actions on authentication status change
    console.log("Authentication status changed:", isAuthenticated);
  }, [isAuthenticated]);
  return (
    <div className="w-screen flex flex-col ">
      {/* //TODO: when is logged in redirect to the corresponding page, else redirect to login page */}

      <Header />
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
