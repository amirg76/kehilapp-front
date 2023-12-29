import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//components
import Sidebar from "@features/sidebar/components/Sidebar";
import MessageList from "../features/messages/components/MessageList";
import Hero from "../features/heroSection/components/Hero";

// api url
import {
  LATEST_MESSAGES_URL,
  MESSAGES_BY_CATEGORY_URL,
} from "@api/apiConstants.js";
const Messages = () => {
  let { categoryId } = useParams();
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    //! demo fetch, to be used only as demo, replace with react query.
    const getData = async () => {
      let url;
      if (!categoryId) {
        url = LATEST_MESSAGES_URL;
      } else {
        url = `${MESSAGES_BY_CATEGORY_URL}/${categoryId}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        let json = await response.json();
        setMessages(json.data);
      }
    };
    getData();
  }, [categoryId]);

  return (
    <div className="flex flex-1 w-full bg-[#efefef]">
      {/* sidebar & content split side by side */}
      <Sidebar />
      <div className="w-full h-full">
        <Hero />
        <MessageList messages={messages} />
      </div>
    </div>
  );
};

export default Messages;
