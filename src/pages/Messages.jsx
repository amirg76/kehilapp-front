import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@features/sidebar/components/Sidebar";
import MessageList from '../features/messages/components/MessageList'

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
        <MessageList />
      </div>
    </div>
  );
};

export default Messages;
