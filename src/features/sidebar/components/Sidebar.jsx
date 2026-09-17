import React, { useState } from "react";
// routes
import { MESSAGES } from "@routes/routeConstants";
// components
import SidebarItem from "@features/sidebar/components/SidebarItem";
// api url
import { CATEGORY_URL } from "@api/apiConstants.js";
import { useQuery } from "react-query";
import { httpService } from "../../../services/httpService";

//redux use functions
import { useDispatch, useSelector } from "react-redux";

//redux actions
import { categoryActions } from "@store/slices/categorySlice";
import MessageForm from "../../messageForm/components/MessageForm/MessageForm";
import NavBarButton from "@components/Header/NavBarButton";

const Sidebar = ({ classes, onCloseNavbar, open, variant = "page" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const {
    data: fetchedCategories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return httpService.get(CATEGORY_URL);
    },
  });

  const toggleModal = (boolean) => {
    setIsModalOpen(boolean);
  };

  //TODO: imlemet redux for categories
  // useEffect(() => {
  //   console.log(fetchedCategories);
  //   if (fetchedCategories) {
  //     dispatch(messageActions.loadMessages(fetchedMessages));
  //   }
  // }, [fetchedCategories, dispatch]);

  return (
    <aside
      className={`${
        classes || "hidden md:block"
      } bg-white dark:bg-slate-800 border-e dark:border-white/10 shadow-sm`}
    >
      <nav
        className={`${
          !open && "top-24"
        } flex flex-col w-72 sticky`}
      >
        {/* Auth entry points inside the hamburger drawer. Same component as the
            desktop header, so signup/login stay in sync across breakpoints. */}
        {open && (
          <div className="px-4 pt-4 pb-5 border-b border-black/10 dark:border-white/10">
            <NavBarButton />
          </div>
        )}
        <h3 className="text-xl font-semibold ms-6 mb-2 mt-8 dark:text-slate-100">קטגוריה</h3>
        {/* nav links */}
        <ul className="mb-5 ms-6 pl-2 text-lg">
          <SidebarItem
            key="0"
            title="ראשי"
            color="categoryBlue"
            link={`${MESSAGES}`}
            icon="ראשי"
            onCloseNavbar={onCloseNavbar}
          />

          {fetchedCategories?.length &&
            fetchedCategories.map((category) => (
              <SidebarItem
                key={category._id}
                title={category.title}
                color={category.categoryColor}
                link={`${MESSAGES}/${category._id}`}
                icon={category.icon}
                onCloseNavbar={onCloseNavbar}
              />
            ))}
        </ul>

        {/* New Message Button */}
        {isAuthenticated && (
          <button
            data-testid={`sidebar-compose-${variant}`}
            className="p-2 rounded-md text-lg mx-10 bg-primary-700 hover:bg-primary-600 active:bg-primary-800 text-white"
            onClick={() => {
              // TODO: open a new message model on click
              setIsModalOpen(true);
            }}
          >
            הוסף הודעה
          </button>
        )}
        <MessageForm
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          categories={fetchedCategories}
        />
        <hr className="mt-5" />
      </nav>
    </aside>
  );
};

export default Sidebar;
