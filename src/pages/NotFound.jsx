import React from "react";
import { Link } from "react-router-dom";

import { MESSAGES } from "@routes/routeConstants";

// Catch-all for an address that matches no route. Same card and gradient as
// the auth pages so it reads as part of the app, not a server error page.
const NotFound = () => {
  return (
    <div className="flex flex-col flex-1 justify-center items-center min-h-[60vh] px-4 bg-gradient-to-b from-[#EFEFEF] to-white dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md px-8 py-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center">
        <p className="text-5xl font-bold mb-4 text-primary-700 dark:text-primary-300">
          404
        </p>
        <h1 className="text-xl font-bold mb-3 dark:text-slate-100">
          הדף לא נמצא
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          הכתובת שהגעת אליה אינה קיימת, או שההודעה הועברה.
        </p>
        <Link
          to={MESSAGES}
          className="inline-flex w-full items-center justify-center rounded-md border-2 border-solid
                     border-primary-700 py-3 text-lg font-medium text-primary-700 transition-colors
                     hover:bg-primary-700 hover:text-white
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                     focus-visible:ring-offset-2 focus-visible:ring-offset-white
                     dark:border-primary-400 dark:text-primary-200 dark:hover:bg-primary-600
                     dark:hover:text-white dark:focus-visible:ring-offset-slate-800"
        >
          חזרה ללוח ההודעות
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
