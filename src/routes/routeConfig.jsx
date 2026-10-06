import React from "react";
// routing
import { Navigate } from "react-router-dom";
// routes constants
import { ROOT, MESSAGES, LOGIN, REGISTER, VERIFY_EMAIL } from "@routes/routeConstants.js";
// pages
import Messages from "@pages/Messages.jsx";
import Login from "@pages/Login.jsx";
import Register from "@pages/Register.jsx";
import VerifyEmail from "@pages/VerifyEmail.jsx";
import NotFound from "@pages/NotFound.jsx";

const routeConfig = [
  {
    // Main Page - Redirect to the messages page if user
    path: ROOT,
    element: <Navigate to={MESSAGES} />,
    exact: true,
  },
  {
    // Login Page
    path: LOGIN,
    element: <Login />,
    exact: true,
  },
  {
    // Registration Page
    path: REGISTER,
    element: <Register />,
    exact: true,
  },
  {
    // Email verification Page (reads ?token= query param)
    path: VERIFY_EMAIL,
    element: <VerifyEmail />,
    exact: true,
  },
  {
    // messages page, redirects to the main category
    path: MESSAGES,
    element: <Messages />,
    exact: true,
  },
  {
    path: `${MESSAGES}/:categoryId`,
    element: <Messages />,
    exact: true,
  },
  {
    // Anything else: a Hebrew 404 with a way back to the board. Must stay last.
    path: "*",
    element: <NotFound />,
  },
];

export default routeConfig;
