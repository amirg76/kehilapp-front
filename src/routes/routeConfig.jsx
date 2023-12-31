import React from "react";
// routing
import { Navigate } from "react-router-dom";
// routes constants
import { ROOT, MESSAGES } from "@routes/routeConstants.js";
// pages
import Messages from "@pages/Messages.jsx";

const routeConfig = [
  {
    // Main Page - Redirect to the messages page if user
    path: ROOT,
    element: <Navigate to={MESSAGES} />,
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
  //TODO: create a 404 Page for non-existing pages and import here
  //   {
  //     path: "*",
  //     element: "", //404 page
  //     exact: true,
  //   },
];

export default routeConfig;
