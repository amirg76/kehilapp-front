import React, { useEffect, useState } from "react";
// routes
import { MESSAGES } from "@routes/routeConstants";
// components
import SidebarItem from "@features/sidebar/components/SidebarItem";
// api url
import { CATEGORY_URL } from "@api/apiConstants.js";

const Sidebar = ({ classes }) => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const getData = async () => {
      //! demo fetch, to be used only as demo, replace with react query.
      const response = await fetch(CATEGORY_URL);
      if (response.ok) {
        let json = await response.json();
        setCategories(json.data);
      }
    };
    getData();
  }, []);

  return (
    <aside className={`${classes || "hidden md:block"}`}>
      <nav className="h-full flex flex-col border-e shadow-sm w-[230px] sticky right-0 top-24">
        <h3 className="text-xl ms-3 mb-2 mt-2">קטגוריה</h3>
        {/* nav links */}
        <ul className="mb-5 ms-2">
          <SidebarItem
            key="0"
            title="ראשי"
            color="categoryBlue"
            link={`${MESSAGES}`}
            icon="ראשי"
          />

          {categories &&
            categories.map((category) => (
              <SidebarItem
                key={category._id}
                title={category.title}
                color={category.categoryColor}
                link={`${MESSAGES}/${category._id}`}
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
