import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import CategoryIcon from "@components/ui/CategoryIcon/CategoryIcon";
import useFetchData from "../UseFetchData/UseFetchData";

const SearchMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  useFetchData(searchTerm);

  return (
    <div className="flex items-center w-1/2 md:w-1/3 sm:1/4 border border-gray-300 rounded-xl bg-white ">
      <FaSearch className="mr-4 text-gray-400 " />

      <input
        type="text"
        placeholder="חיפוש..."
        className="px-4 py-2 focus:outline-none w-full rounded-xl"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchMessages;
