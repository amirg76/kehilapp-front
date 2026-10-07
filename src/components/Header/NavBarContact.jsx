import React from "react";

// Empty on purpose: the kibbutz's contact details (email/phone) were shown here
// in the 2024 pilot and were taken out; the slot stays so the header's layout
// does not change if they come back.
const NavBarContact = () => {
  return (
    // No `container` here: Tailwind's `container` is width:100%, and on an empty
    // placeholder it ate the header's free space and forced the auth buttons to
    // wrap onto two rows (clipped by the h-24 header).
    <div className="flex items-center" />
  );
};

export default NavBarContact;
