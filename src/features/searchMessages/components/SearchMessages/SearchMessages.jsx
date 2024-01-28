import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
// icons
import { FaSearch } from "react-icons/fa";
// redux
import { useDispatch } from "react-redux";
import { messageActions } from "../../../../store/slices/messageSlice";
// api
import { MESSAGES_URL } from "../../../../api/apiConstants.js";
import { httpService } from "../../../../services/httpService";

const SearchMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
    <div className="flex items-center w-1/2 md:w-1/3 sm:1/4 border border-gray-300 rounded-xl bg-white ">
      <FaSearch className="mr-4 text-gray-400 " />

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
