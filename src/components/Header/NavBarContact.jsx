import React from "react";

const NavBarContact = () => {
  return (
    // No `container` here: Tailwind's `container` is width:100%, and on an empty
    // placeholder it ate the header's free space and forced the auth buttons to
    // wrap onto two rows (clipped by the h-24 header).
    <div className="flex items-center">
     {/* TODO add delete or keep this section? */}
      {/* <div className="flex ml-[20px]"> */}
        {/* <h5 className="font-bold text-sm">דוא"ל :</h5> */}
        {/* <p className="text-sm pr-1 text-blue-900">kissufim@kissufim.co.il</p> */}
      {/* </div> */}
      {/* <div className="flex ml-[20px]"> */}
        {/* <h5 className="font-bold text-sm">טלפון :</h5> */}
        {/* <p className="text-sm pr-1">08-5552266</p> */}
      {/* </div> */}
    </div>
  );
};

export default NavBarContact;
