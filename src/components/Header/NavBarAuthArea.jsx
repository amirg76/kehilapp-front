import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// redux

import { authActions } from "@store/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";

import useNavbarHandler from "@hooks/useNavbarHandler";
import useAuthButton from "@hooks/useAuthButton";
// routeConstants
import { ROOT, LOGIN } from "@routes/routeConstants";
import NavBarAuthDetails from "./NavBarAuthDetails";
import NavBarButton from "./NavBarButton";
// check organization url

const NavBarAuthArea = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navbarHandler = useNavbarHandler();

  const handleLogout = () => {
    // Clear token and user information from local storage
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    const user = sessionStorage.removeItem("loggedInUser");

    // Dispatch the logout action
    dispatch(authActions.logout());

    // Close the navbar
    navbarHandler("close");

    // Navigate to home page
    navigate(ROOT);
  };
  const handleLogin = () => {
    navbarHandler("close");

    // Navigate to login page
    navigate(LOGIN);
  };

  const { onClickAuthButton, className, children } = useAuthButton(
    handleLogout,
    handleLogin,
    isAuthenticated
  );

  return (
    <div className="flex flex-shrink-0 items-center mx-auto">
      <ul>
        {isAuthenticated ? (
          NavBarAuthDetails(currentUser, onClickAuthButton, className, children)
        ) : (
          <li>{NavBarButton(onClickAuthButton, className, children)}</li>
        )}
      </ul>
    </div>
  );
};

export default NavBarAuthArea;
