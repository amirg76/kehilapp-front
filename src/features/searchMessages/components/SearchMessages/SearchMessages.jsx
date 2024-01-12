import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import CategoryIcon from "@components/ui/CategoryIcon/CategoryIcon";
import useFetchData from "../UseFetchData/useFetchData";

const SearchMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, isLoading] = useFetchData(searchTerm);
  const handleSearch = async () => {
    // Send the search result to an API
    // try {
    //   const response = await fetch("https://example.com/api/search", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ searchTerm }),
    //   });
    //   if (!response.ok) {
    //     throw new Error("Error sending search result to API");
    //   }
    //   const data = await response.json();
    //   console.log("Search result sent to API:", data);
    // } catch (error) {
    //   console.error("Error:", error.message);
    // }
  };

  return (
    <div className="flex items-center w-1/2 md:w-1/3 sm:1/4 border border-gray-300 rounded-md ">
      <input
        type="text"
        placeholder="חיפוש..."
        className="px-4 py-2 focus:outline-none w-full rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-3"
        onClick={handleSearch}
      >
        <FaSearch />
      </button>
      {console.log(data)}
    </div>
  );
};

export default SearchMessages;
