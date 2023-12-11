import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Messages from "./pages/Messages.jsx";

const App = () => {
  return (
    <>
      <div className="h-[64px] bg-gray-500">NAVBAR COMPONENT</div>
      {/* //TODO: when is logged in redirect to the corresponding page, else redirect to login page */}
      <Routes>
        {/* Main Page - Redirect to the messages page if user */}
        <Route path="/" element={<Navigate to="/messages" />} exact />
        {/* Routes */}
        <Route path="messages" element={<Messages />} exact />
      </Routes>
    </>
  );
};

export default App;
