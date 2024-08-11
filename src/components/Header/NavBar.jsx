import React from "react";
import kibbutzLogo from "./img/logo-kibbuttz-transpert.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import NavBarContact from "./NavBarContact";
import NavBarButton from "./NavBarButton";
import Sidebar from "@features/sidebar/components/Sidebar";
import useNavbarHandler from "@hooks/useNavbarHandler";
import { ROOT } from "@routes/routeConstants";
//redux use functions
import { useSelector } from "react-redux";
import { uiActions } from "@store/slices/uiSlice";
const NavBar = () => {
  const isModalOpen = useSelector((state) => state.ui.isModalOpen);

  return (
    <nav className="flex h-24 items-center justify-between p-10 ">
      <NavLink to={ROOT}>
        {/* <NavBarLogo /> */}
        <img src={kibbutzLogo} alt="" className="h-20" />
      </NavLink>
      <div className="hidden md:flex">
        <NavBarContact />
        <NavBarButton />
      </div>
      <Sidebar
        classes={`max-md:flex flex-column fixed left-0 top-0 bg-white opacity-90
             h-screen border-l-[1px]-[#ebebeb] z-30 transition-transform duration-600 pt-3
             ${isModalOpen ? "translate-x-0" : "translate-x-[-100%] md:flex"}`}
        onCloseNavbar={useNavbarHandler("close")}
        open={isModalOpen}
      />

      <FontAwesomeIcon
        className="md:hidden"
        onClick={useNavbarHandler("open")}
        icon={faBars}
      />
    </nav>
  );
};

export default NavBar;
