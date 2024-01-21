import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux"
import { messageActions } from "../../../../store/slices/messageSlice";


const SearchMessages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch()
  const filterBy = useSelector(state => state.message.filterBy)

  useEffect(() => {
    setFilterBy(searchTerm)
  }, [searchTerm])

  useEffect(() => {
    if (filterBy.latest) setSearchTerm("")
  }, [filterBy])

  const setFilterBy = (searchTerm) => {
    console.log(filterBy);
    if (!searchTerm && !filterBy.categoryId) dispatch(messageActions.setFilterBy({ ...filterBy, searchTerm, latest: true }))
    else dispatch(messageActions.setFilterBy({ ...filterBy, searchTerm, latest: false }))
  }

  return (
    <div className="flex items-center w-1/2 md:w-1/3 sm:1/4 border border-gray-300 rounded-md ">
      <input
        type="text"
        placeholder="חיפוש..."
        className="px-4 py-2 focus:outline-none w-full rounded-md"
        value={searchTerm}
        onChange={(ev) => setSearchTerm(ev.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-3"
        onClick={(ev) => setSearchTerm(ev.target.value)}
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default SearchMessages;
