import React from "react";
// routing
import { Navigate } from "react-router-dom";
// routes constants
import { ROOT, MESSAGES, LOGIN } from "@routes/routeConstants.js";
// pages
import Messages from "@pages/Messages.jsx";
import Login from "@pages/Login";

const routeConfig = [
  // {
  //   // Root Page - Redirect to the login page
  //   path: ROOT,
  //   element: <Navigate to={LOGIN} />,
  //   exact: true,
  // },
  // {
  //   // Login Page
  //   path: LOGIN,
  //   element: <Login />,
  //   exact: true,
  // },
  // {
  //   // Main Page - Redirect to the messages page if user
  //   path: ROOT,
  //   element: <Navigate to={MESSAGES} />,
  //   exact: true,
  // },
  {
    // messages page, redirects to the main category
    path: MESSAGES,
    element: <Messages />,
    // element: isAuthenticate ? (
    //   <Header>{<Messages />}</Header>
    // ) : (
    //   <Navigate to={LOGIN} />
    // ),
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
