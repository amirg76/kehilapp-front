import React, { useState } from "react";
// routes
import { MESSAGES } from "@routes/routeConstants";
// components
import SidebarItem from "@features/sidebar/components/SidebarItem";
// api url
import { CATEGORY_URL } from "@api/apiConstants.js";

import { useQuery } from 'react-query';
import { httpService } from "../../../services/httpService";

//redux use functions
import { useDispatch, useSelector } from "react-redux";

//redux actions
import { categoryActions } from "@store/slices/categorySlice";
import MessageForm from "../../messageForm/components/MessageForm/MessageForm";
import { useDispatch, useSelector } from "react-redux"
import { messageActions } from "../../../store/slices/messageSlice";

const Sidebar = ({ classes, onCloseNavbar }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const filterBy = useSelector(state => state.message.filterBy)
  const dispatch = useDispatch()

  const { data: fetchedCategories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return httpService.get(CATEGORY_URL);

    }
  });

  const setFilterBy = (categoryId) => {
    if (categoryId) {
      dispatch(messageActions.setFilterBy({ ...filterBy, categoryId, latest: false }))
    } else {
      //if you click on "ראשי" the search is cancled.
      dispatch(messageActions.setFilterBy({ searchTerm: "", categoryId: "", latest: true }))
    }
  }

  //TODO: imlemet redux for categories
  // useEffect(() => {
  //   console.log(fetchedCategories);
  //   if (fetchedCategories) {
  //     dispatch(messageActions.loadMessages(fetchedMessages));
  //   }
  // }, [fetchedCategories, dispatch]);


  return (
    <aside className={`${classes || "hidden md:block"}`}>
      <nav className="h-full flex flex-col border-e shadow-sm w-80 sticky right-0 top-24">
        <h3 className="text-xl font-semibold ms-6 mb-2 mt-8">קטגוריה</h3>
        {/* nav links */}
        <ul className="mb-5 ms-6 text-lg">
          <SidebarItem
            key="0"
            title="ראשי"
            color="categoryBlue"
            link={`${MESSAGES}`}
            icon="ראשי"
            onCloseNavbar={onCloseNavbar}
            setFilterBy={setFilterBy}
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
                setFilterBy={() => setFilterBy(category._id)}
              />
            ))}
        </ul>

        {/* New Message Button */}
        <button
          className="p-2 rounded-md text-lg mx-10 bg-primary-700 hover:bg-primary-600 active:bg-primary-800 text-white"
          onClick={() => {
            // TODO: open a new message model on click

            setIsModalOpen(true);
          }}
        >
          הוסף הודעה
        </button>
        {isModalOpen && fetchedCategories && (
          <MessageForm
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            categories={fetchedCategories}
          />
        )}
        <hr className="mt-5" />
      </nav>
    </aside>
  );
};

export default Sidebar;
