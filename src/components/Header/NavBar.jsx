import React from "react";
import kibbutzLogo from "./img/logo-kibbuttz-transpert.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import NavBarContact from "./NavBarContact";
import NavBarButton from "./NavBarButton";
import Sidebar from "@features/sidebar/components/Sidebar";
import { ROOT } from "@routes/routeConstants";
//redux use functions
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "@store/slices/uiSlice";
const NavBar = () => {
  const isModalOpen = useSelector((state) => state.ui.isModalOpen);
  const dispatch = useDispatch();
  /**
   * Opens the navbar by dispatching the openModal action.
   *
   * @return {void} No return value.
   */
  const onOpenNavbar = () => {
    dispatch(uiActions.openModal());
  };

  /**
   * Closes the navbar after a short delay.
   *
   * @return {void} No return value.
   */
  const onCloseNavbar = () => {
    setTimeout(() => {
      dispatch(uiActions.closeModal());
    }, 300);
  };

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
        onCloseNavbar={onCloseNavbar}
        open={isModalOpen}
      />

      <FontAwesomeIcon
        className="md:hidden"
        onClick={onOpenNavbar}
        icon={faBars}
      />
    </nav>
  );
};

export default NavBar;
