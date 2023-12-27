import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//components
import Sidebar from "@features/sidebar/components/Sidebar";
import MessageList from "../features/messages/components/MessageList";
import HeroSection from "../features/heroSection/components/HeroSection";
// api url
import { MESSAGES_URL } from "@api/apiConstants.js";
const Messages = () => {
  let { categoryId } = useParams();
  const [messages, setMessages] = useState(null);
  //TODO: fetch messages based on the "categoryName" to the API
  useEffect(() => {
    //! demo fetch, to be used only as demo, replace with react query.
    const getData = async () => {
      if (!categoryId) {
        categoryId = "all";
      }
      const response = await fetch(`${MESSAGES_URL}/category/${categoryId}`);
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
      <div className="flex flex-col">
        <HeroSection />
        <MessageList messages={messages} />
      </div>
    </div>
  );
};

export default Messages;
