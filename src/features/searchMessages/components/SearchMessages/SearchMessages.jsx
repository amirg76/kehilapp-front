import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
// icons
import { FaSearch } from "react-icons/fa";
// redux
import { useDispatch, useSelector } from "react-redux";
import { messageActions } from "../../../../store/slices/messageSlice";
// api
import { MESSAGES_URL } from "../../../../api/apiConstants.js";
import { httpService } from "../../../../services/httpService";

const SearchMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const isModalOpen = useSelector((state) => state.ui.isModalOpen);
  const dispatch = useDispatch();
  const { categoryId = "" } = useParams();

  const {
    data: fetchedMessages,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["messages", searchTerm, categoryId],
    queryFn: () => {
      return httpService.get(
        `${MESSAGES_URL}?searchTerm=${encodeURI(
          searchTerm
        )}&categoryId=${encodeURI(categoryId)}`
      );
    },
  });

  useEffect(() => {
    if (fetchedMessages) {
      dispatch(messageActions.loadMessages(fetchedMessages));
    }
  }, [fetchedMessages, dispatch]);

  return (
    <div
      className={`${
        !isModalOpen && "z-10"
      } flex items-center w-[90%] sm:w-[320px] border border-gray-300 rounded-xl bg-white sticky top-[80px] sm:top-[75px] mt-[-22px] mb-5 mx-auto shadow-md `}
    >
      {/* <div className="flex items-center w-[90%] sm:w-[320px] border border-gray-300 rounded-xl bg-white sticky top-[80px] sm:top-[75px] mt-[-22px] mb-5 mx-auto z-10 shadow-md"> */}
      <FaSearch className="mr-4 text-gray-400" />
      <input
        type="text"
        placeholder="חיפוש..."
        className="px-4 py-2 focus:outline-none w-full rounded-xl"
        value={searchTerm}
        onChange={(ev) => setSearchTerm(ev.target.value)}
      />
    </div>
  );
};

export default SearchMessages;
