import React from "react";
// routes
import { MESSAGES } from "@routes/routeConstants";
// components
import SidebarItem from "@features/sidebar/components/SidebarItem";
//demo data
import categories from "@demo-data/demoCategories.json";

const Sidebar = ({ classes }) => {
  return (
    <aside className={`${classes ? classes : 'hidden md:block'}`}>
      <nav className="h-full flex flex-col border-e shadow-sm w-[230px] sticky right-0 top-24">
        <h3 className="text-xl ms-3 mb-2 mt-2">קטגוריה</h3>
        {/* nav links */}
        <ul className="mb-5 ms-2">
          {categories &&
            categories.map((category) => (
              <SidebarItem
                key={category._id}
                title={category.title}
                color={category.color}
                link={`${MESSAGES}/${category.link}`}
                icon={category.icon}
              />
            ))}
        </ul>

        {/* New Message Button */}
        <button
          className="p-2 rounded-md mx-10 bg-primary-700 hover:bg-primary-600 active:bg-primary-800 text-white"
          onClick={() => {
            // TODO: open a new message model on click
            console.log("Open New Message Modal");
          }}
        >
          הוסף הודעה
        </button>
        <hr className="mt-5" />
      </nav>
    </aside>
  );
};

export default Sidebar;
