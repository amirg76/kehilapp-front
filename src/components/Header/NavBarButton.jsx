import React from "react";
import { Link, useNavigate } from "react-router-dom";
// redux
import { uiActions } from "@store/slices/uiSlice";
import { authActions } from "@store/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";

// routeConstants
import { ROOT, LOGIN, REGISTER } from "@routes/routeConstants";
import { AUTH_URL } from "@api/apiConstants";
import { httpService, queryClient } from "@/services/httpService";
// check organization url

// Shared button geometry. Kept in one place so the primary/secondary pair reads
// as a single control group in the header and in the mobile drawer.
const BASE_ACTION =
  "inline-flex items-center justify-center rounded-lg py-3 px-6 text-center " +
  "font-assistant font-semibold text-sm leading-5 whitespace-nowrap transition-colors " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-800";

// Primary (filled). primary-700 keeps 5.0:1 with white text in BOTH themes; the
// dark-mode ring is what separates the fill from the slate-800 header, since the
// fill itself sits at ~2.9:1 against it.
const PRIMARY_ACTION =
  // border-2 border-transparent only equalizes the box with the outlined
  // secondary so the pair sits on one baseline.
  `${BASE_ACTION} border-2 border-solid border-transparent ` +
  "bg-primary-700 text-white hover:bg-primary-600 active:bg-primary-800 " +
  "dark:ring-1 dark:ring-primary-400/50";

// Secondary (outline / ghost). Visible in both themes without competing with the
// filled primary.
const SECONDARY_ACTION =
  `${BASE_ACTION} border-2 border-solid border-primary-700 text-primary-700 ` +
  "hover:bg-primary-700 hover:text-white " +
  "dark:border-primary-400 dark:text-primary-200 dark:hover:bg-primary-600 dark:hover:text-white";

const NavBarButton = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear the httpOnly session cookie on the server (localStorage no longer
    // holds the token — it lives in an httpOnly cookie the browser sends).
    try {
      await httpService.post(`${AUTH_URL}/logout`);
    } catch {
      // Even if the network call fails, still clear local UI state below.
    }

    sessionStorage.removeItem("loggedInUser");
    dispatch(authActions.logout());
    dispatch(uiActions.closeModal());

    // Drop cached members-only content so it disappears immediately on logout.
    queryClient.invalidateQueries({ queryKey: ["messages"] });
    queryClient.invalidateQueries({ queryKey: ["users"] });

    navigate(ROOT);
  };

  // Closing the mobile drawer on navigation — the same component is rendered
  // inside the hamburger drawer, where a link click must dismiss the overlay.
  const closeDrawer = () => dispatch(uiActions.closeModal());

  return (
    <div
      data-testid="auth-actions"
      className="flex flex-wrap items-center justify-center gap-2 px-2"
    >
      {isAuthenticated ? (
        <>
          <span
            data-testid="header-greeting"
            className="px-2 text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            שלום {currentUser?.name || currentUser?.email}!
          </span>
          <button
            type="button"
            data-testid="header-logout"
            onClick={handleLogout}
            className={SECONDARY_ACTION}
          >
            התנתק
          </button>
        </>
      ) : (
        <>
          {/* Signup is the primary action: reading this board is already public,
              so the visitor who has something to gain from a click is the one
              without an account. Login stays a full outlined button (not a text
              link) so returning members are not demoted to a weak affordance. */}
          <Link
            to={REGISTER}
            data-testid="header-register"
            onClick={closeDrawer}
            className={PRIMARY_ACTION}
          >
            הרשמה
          </Link>
          <Link
            to={LOGIN}
            data-testid="header-login"
            onClick={closeDrawer}
            className={SECONDARY_ACTION}
          >
            התחבר
          </Link>
        </>
      )}
    </div>
  );
};

export default NavBarButton;
