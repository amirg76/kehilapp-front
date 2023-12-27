import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import Sidebar from "@features/sidebar/components/Sidebar";
import MessageList from '../features/messages/components/MessageList'
import HeroSection from "../features/heroSection/components/HeroSection";
import demoMessages from '../demo-data/demoData.json'
import { messageActions } from '../store/slices/messageSlice'

const Messages = () => {
  let { categoryName } = useParams();

  const messages = useSelector(state => state.message.messages)
  const dispatch = useDispatch()

  //TODO: fetch messages based on the "categoryName" to the API
  useEffect(() => {
    dispatch(messageActions.loadMessages(demoMessages))
    console.log(`fetching ${categoryName} messages!`);
  }, [categoryName]);

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
