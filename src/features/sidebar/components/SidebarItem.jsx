import React from "react";
import placeholderIcon from "../icons/placeholderIcon.svg";
//react router
import { useLocation, Link } from "react-router-dom";

const SidebarItem = ({ title, color, link, icon }) => {
  //get current location
  let location = useLocation();

  //returns the class name for tailwind, based on tailwind's documentation
  const gradientActiveColorClass = (color) => {
    if (!color) {
      return "";
    }
    return `bg-gradient-to-r  from-${color}`;
  };

  return (
    <li>
      <Link
        to={`${link}`}
        // if link is clicked apply color, otherwise apply gray bg on hover
        className={`flex text-l items-center p-2 pe-3 ${
          location.pathname === link
            ? gradientActiveColorClass(color)
            : "hover:font-bold hover:bg-gray-200"
        }`}
      >
        {/* //TODO: Replace the img tag with a custom component that renders the icon */}
        {icon && <img src={placeholderIcon} alt="icon" className="me-2" />}
        {title}
      </Link>
    </li>
  );
};

export default SidebarItem;