import React from "react";
//react router
import { useLocation, Link } from "react-router-dom";
import CategoryIcon from "../../../components/ui/CategoryIcon/CategoryIcon";

const SidebarItem = ({ title, color, icon, link, onCloseNavbar }) => {
  //get current location
  let location = useLocation();
  const isActive = location.pathname === link;

  return (
    <li
      onClick={() => {
        onCloseNavbar && onCloseNavbar();
      }}
    >
      <Link
        to={`${link}`}
        // Crisp SVG icon (CategoryIcon) + smooth hover animation: subtle
        // background, slight indent and lift on hover, in both themes.
        className={`group flex text-l items-center p-2 pe-3 mb-3 rounded-lg
          text-slate-700 dark:text-slate-200
          transition-all duration-200 ease-out will-change-transform
          hover:-translate-x-1 hover:shadow-sm ${
          isActive
            ? `bg-gradient-to-r from-${color} font-semibold`
            : "hover:bg-gray-200 dark:hover:bg-slate-700"
        }`}
      >
        <span className="text-[#545454] dark:text-slate-200 transition-colors">
          <CategoryIcon categoryTitle={icon} color="currentColor" />
        </span>
        <span className="mr-6 transition-transform duration-200 group-hover:translate-x-0.5">
          {title}
        </span>
      </Link>
    </li>
  );
};

export default SidebarItem;
