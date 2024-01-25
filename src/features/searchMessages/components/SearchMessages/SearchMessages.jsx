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

  const setFilterBy = (searchTerm) => {
    console.log(filterBy);
    if (!searchTerm && !filterBy.categoryId) dispatch(messageActions.setFilterBy({ ...filterBy, searchTerm, latest: true }))
    else dispatch(messageActions.setFilterBy({ ...filterBy, searchTerm, latest: false }))
  }

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
