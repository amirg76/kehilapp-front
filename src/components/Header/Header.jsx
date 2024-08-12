import React from "react";

import NavBarLogo from "./NavBarLogo";
// import NavBarContact from "./NavBarContact";
// import NavBarButton from "./NavBarButton";
// import Sidebar from "@features/sidebar/components/Sidebar";
// import kibbutzLogo from "./img/logo-kibbuttz-transpert.png";
// //redux use functions
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "@store/slices/uiSlice";
// routeConstants
// import { ROOT } from "@routes/routeConstants";
import NavBar from "./NavBar";

/**
 * A functional component representing the application header.
 * It includes a navigation bar with a logo, contact and button links,
 * as well as a sidebar that can be toggled open or closed.
 *
 * @return {JSX.Element} The JSX element representing the application header.
 */
const Header = () => {
  const isModalOpen = useSelector((state) => state.ui.isModalOpen);
  const dispatch = useDispatch();
  // /**
  //  * Closes the navbar after a short delay.
  //  *
  //  * @return {void} No return value.
  //  */
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
      <NavBar />
    </header>
  );
};

export default Header;
