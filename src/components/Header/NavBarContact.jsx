import React from "react";

const NavBarContact = () => {
  return (
    <div className="container flex justify-around items-center">
      <div className="flex justify-between">
        <h5 className="font-bold text-sm">דוא"ל :</h5>
        <p className="text-sm pr-1 text-blue-900">kissufim@kissufim.co.il</p>
      </div>
      <div className="flex">
        <h5 className="font-bold text-sm">טלפון :</h5>
        <p className="text-sm pr-1">08-5552266</p>
      </div>
    </div>
  );
};

export default NavBarContact;
