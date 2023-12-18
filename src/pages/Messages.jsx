import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "@features/sidebar/components/Sidebar";
import MessageList from '../features/messages/components/MessageList'
import HeroSection from "../features/heroSection/components/HeroSection";

const Messages = () => {
  let { categoryName } = useParams();

  //TODO: fetch messages based on the "categoryName" to the API
  useEffect(() => {
    console.log(`fetching ${categoryName} messages!`);
  }, [categoryName]);

  return (
    <div className="flex">
      {/* sidebar & content split side by side */}
      <Sidebar />
      <div className="flex flex-col">
        <HeroSection />
        <MessageList />
      </div>
    </div>
  );
};

export default Messages;
