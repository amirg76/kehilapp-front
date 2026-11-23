import React from "react";
import { Link } from "react-router-dom";

import logoKisufim from "../img/logo-kibbuttz-transpert.png";
import { MESSAGES } from "@routes/routeConstants";

// The auth screens (login, register, verify email) hide the app header, so a
// visitor who opened one of them, or came from an email link, had no way back
// to the public board except the browser's back button (22.11.2026).
// One component for the three screens, so the way back looks the same on each.
const AuthLogoHeader = ({ logoClassName = "w-[11em]", className = "mb-2" }) => (
  <div className={`w-full max-w-md flex flex-col items-center ${className}`}>
    <Link
      to={MESSAGES}
      data-testid="back-to-board"
      // primary-800, not 700: the page is #EFEFEF at the top, and 700 there is
      // 4.35:1 (800: 5.77). The ring is 700 for the 3:1 a focus mark needs.
      className="self-start inline-flex items-center gap-1 py-2 rounded text-sm font-medium
                 text-primary-800 hover:underline dark:text-primary-300
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700
                 dark:focus-visible:ring-primary-300"
    >
      {/* RTL: "back" points right. */}
      <span aria-hidden="true">→</span>
      חזרה ללוח ההודעות
    </Link>
    {/* The logo leads to the board too, as on most sites. It is out of the tab
        order and hidden from screen readers: the text link above is the same
        place, and two links in a row to one target is noise for them. */}
    <Link to={MESSAGES} tabIndex={-1} aria-hidden="true" data-testid="logo-to-board">
      <img
        className={`${logoClassName} dark:rounded-xl dark:bg-white/90 dark:p-2`}
        src={logoKisufim}
        alt=""
      />
    </Link>
  </div>
);

export default AuthLogoHeader;
