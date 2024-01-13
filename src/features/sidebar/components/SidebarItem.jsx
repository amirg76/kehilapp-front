import React from "react";
//react router
import { useLocation, Link } from "react-router-dom";
import CategoryIcon from "../../../components/ui/CategoryIcon/CategoryIcon";

const SidebarItem = ({ title, color, icon, link, onCloseNavbar }) => {
  //get current location
  let location = useLocation();

  return (
    <li onClick={onCloseNavbar}>
      <Link
        to={`${link}`}
        // if link is clicked apply color, otherwise apply gray bg on hover
        className={`flex text-l items-center p-2 pe-3 mb-3 ${
          location.pathname === link
            ? `bg-gradient-to-r  from-${color}`
            : "hover:font-bold hover:bg-gray-200"
        }`}
      >
        <CategoryIcon categoryTitle={icon} color="#545454" />
        <span className="mr-3">{title}</span>
      </Link>
    </li>
  );
};

export default SidebarItem;
