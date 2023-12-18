import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@features/sidebar/components/Sidebar";

const Messages = () => {
  let { categoryName } = useParams();

  //TODO: fetch messages based on the "categoryName" to the API
  useEffect(() => {
    console.log(`fetching ${categoryName} messages!`);
  }, [categoryName]);

  return (
    <div>
      {/* sidebar & content split side by side */}
      <div className="flex">
        <Sidebar />
        {/* //TODO: Change to message cards components */}
        <h1>HERO Section</h1>
        <h1 className="uppercase">Message Cards goes here Placeholder</h1>
      </div>
    </div>
  );
};

export default Messages;
