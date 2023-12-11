import React from "react";
//routing
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ROOT, MESSAGES, MAIN_CATEGORY } from "@routes/routeConstants.js";
//components
//TODO: import NAVBAR
import Messages from "./pages/Messages.jsx";

const App = () => {
  return (
    <>
      <div className="h-[64px] bg-gray-500">NAVBAR COMPONENT</div>
      {/* //TODO: when is logged in redirect to the corresponding page, else redirect to login page */}
      <Routes>
        {/* Main Page - Redirect to the messages page if user */}
        <Route
          path={ROOT}
          element={<Navigate to={MESSAGES + MAIN_CATEGORY} />}
          exact
        />
        {/* Routes */}
        <Route
          path={MESSAGES}
          element={<Navigate to={MESSAGES + MAIN_CATEGORY} />}
          exact
        />
        <Route
          path={`${MESSAGES}/:categoryName`}
          element={<Messages />}
          exact
        />

        {/* //TODO: create a 404 Page for non-existing pages */}
        {/* 404 Page for non-existing pages */}
        {/* <Route path="*" element={} exact /> */}
      </Routes>
    </>
  );
};

export default App;
