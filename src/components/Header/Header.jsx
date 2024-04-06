import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import NavBarLogo from "./NavBarLogo";
import NavBarContact from "./NavBarContact";
import NavBarButton from "./NavBarButton";
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

  const onOpenNavbar = () => {
    dispatch(uiActions.openModal());
  };

  const onCloseNavbar = () => {
    setTimeout(() => {
      dispatch(uiActions.closeModal());
    }, 300);
  };

  return (
    <header className="sticky top-0 right-0 z-10 bg-white border-[#0000001a] border-solid shadow-navShadow">
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
          <img src={kibbutzLogo} alt="" className="h-20" />
        </NavLink>
        <div className="hidden md:flex">
          <NavBarContact />
          <NavBarButton />
        </div>
        <Sidebar
          classes={`max-md:flex flex-column fixed left-0 top-0 bg-white opacity-90
                   h-screen border-l-[1px]-[#ebebeb] z-30 transition-transform duration-600 pt-3
                   ${
                     isModalOpen
                       ? "translate-x-0"
                       : "translate-x-[-100%] md:flex"
                   }`}
          onCloseNavbar={onCloseNavbar}
          open={isModalOpen}
        />

        <FontAwesomeIcon
          className="md:hidden"
          onClick={onOpenNavbar}
          icon={faBars}
        />
      </nav>
    </header>
  );
};

export default Header;
