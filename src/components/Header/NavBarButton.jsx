import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// redux
import { authActions } from "@store/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";

const NavBarButton = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token and user information from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Dispatch the logout action
    dispatch(authActions.logout());

    // Navigate to home page
    navigate("/");
  };

  return (
    <div className="flex flex-shrink-0 items-center ">
      <ul>
        {isAuthenticated ? (
          <li>
            <div className="flex flex-shrink-0 items-center ">
              <div className="flex flex-shrink-0 items-center p-2 ">
                שלום {currentUser.name}!
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg border-2 border-solid border-4870ad py-3 px-8 text-000000 border-backgroundButton text-center font-assistant font-semibold text-sm leading-5'"
              >
                התנתק
              </button>
            </div>
          </li>
        ) : (
          <li>
            <Link to="/login">
              <button className="rounded-lg border-2 border-solid border-4870ad py-3 px-8 text-000000 border-backgroundButton text-center font-assistant font-semibold text-sm leading-5'">
                התחבר
              </button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default NavBarButton;
