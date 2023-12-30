import React from "react";
// routing
import { Navigate } from "react-router-dom";
// routes constants
import { ROOT, MESSAGES, MAIN_CATEGORY } from "@routes/routeConstants.js";
// pages
import Messages from "@pages/Messages.jsx";

const routeConfig = [
  {
    // Main Page - Redirect to the messages page if user
    path: ROOT,
    element: <Navigate to={MESSAGES + MAIN_CATEGORY} />,
    exact: true,
  },
  {
    // messages page, redirects to the main category
    path: MESSAGES,
    element: <Navigate to={MESSAGES + MAIN_CATEGORY} />,
    exact: true,
  },
  {
    path: `${MESSAGES}/:categoryName`,
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
