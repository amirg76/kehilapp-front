import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavBarLogo from "./NavBarLogo";
import NavBarContact from "./NavBarContact";
import NavBarButton from "./NavBarButton";
import ThemeToggle from "./ThemeToggle";
import Sidebar from "@features/sidebar/components/Sidebar";
import kibbutzLogo from "./img/logo-kibbuttz-transpert.png";
//redux use functions
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "@store/slices/uiSlice";
// routeConstants
import { ROOT } from "@routes/routeConstants";

const Header = () => {
  const isModalOpen = useSelector((state) => state.ui.isModalOpen);
  const dispatch = useDispatch();
  const hamburgerRef = useRef(null);

  const onOpenNavbar = () => {
    dispatch(uiActions.openModal());
  };

  const onCloseNavbar = () => {
    setTimeout(() => {
      dispatch(uiActions.closeModal());
      // inert lands on an ancestor of whatever had focus inside the drawer, so
      // the browser drops focus to <body> when it closes. Return it to the
      // control that opened the drawer instead of leaving it stranded.
      hamburgerRef.current?.focus();
    }, 300);
  };

  return (
    <header className="sticky top-0 right-0 z-10 bg-white dark:bg-slate-800 border-[#0000001a] dark:border-white/10 border-solid shadow-navShadow">
      <div
        className={
          isModalOpen
            ? "main-screen opacity-100 pointer-events-auto"
            : "main-screen"
        }
        onClick={() => onCloseNavbar()}
      ></div>

      <nav className="flex h-24 items-center justify-between p-10 ">
        <NavLink to={ROOT}>
          {/* <NavBarLogo /> */}
          <img src={kibbutzLogo} alt="כיסופים — דף הבית" className="h-20" />
        </NavLink>
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <NavBarContact />
          <NavBarButton />
          <ThemeToggle />
        </div>
        {/* The drawer used to carry opacity-90: page content bled through it and
            dropped the auth buttons below the WCAG AA contrast threshold
            (axe serious/color-contrast, light theme, 390px). Now opaque. */}
        <Sidebar
          classes={`max-md:flex flex-column fixed left-0 top-0 bg-white
                   h-screen border-l-[1px]-[#ebebeb] z-30 pt-3
                   ${
                     isModalOpen
                       ? "translate-x-0 visible [transition:transform_600ms,visibility_0s]"
                       : "translate-x-[-100%] md:flex invisible [transition:transform_600ms,visibility_0s_600ms]"
                   }`}
          onCloseNavbar={onCloseNavbar}
          open={isModalOpen}
          variant="drawer"
          // The drawer used to hide itself with a transform only, so while
          // closed it stayed visible to CSS: off-canvas but still in the DOM,
          // still focusable and still in the accessibility tree -- at every
          // width, desktop included. Walking the tab order at 1280 landed on
          // its controls off the left edge of the screen, and the page renders
          // its own Sidebar too, so "הוסף הודעה" was announced twice.
          // `invisible` above is what removes it from the tab order in EVERY
          // browser; inert alone would only work where inert is supported, and
          // aria-hidden on a focusable element is a violation in its own right
          // rather than a fallback. The visibility transition is delayed by the
          // length of the slide so the drawer still animates out instead of
          // vanishing the moment it starts moving.
          {...(!isModalOpen && { inert: "", "aria-hidden": "true" })}
        />
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            ref={hamburgerRef}
            type="button"
            onClick={onOpenNavbar}
            aria-label="פתח תפריט קטגוריות"
            className="flex items-center justify-center w-10 h-10 rounded-md text-slate-700 hover:bg-slate-100 transition-colors dark:text-slate-100 dark:hover:bg-slate-700"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
