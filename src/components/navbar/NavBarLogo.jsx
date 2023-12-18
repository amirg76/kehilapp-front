import React from "react";

const NavBarLogo = () => {
  return (
    <div className="flex flex-1 items-center justify-center  sm:justify-start ">
      <div className="">
        <img
          className="h-10 w-auto"
          src="/img/company-logo.png"
          alt="Your Company"
        />
      </div>
    </div>
  );
};

export default NavBarLogo;
