import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from 'react-query';

//components
import Sidebar from "@features/sidebar/components/Sidebar";
import MessageList from "../features/messages/components/MessageList";
import Hero from "../features/heroSection/components/Hero";
import { messageActions } from "../store/slices/messageSlice";
import { useDispatch, useSelector } from "react-redux"

// api url
import { LATEST_MESSAGES_URL, MESSAGES_BY_CATEGORY_URL } from "@api/apiConstants.js";
import { httpService } from "../services/httpService";

const Messages = () => {
  const { categoryId } = useParams();
  const messages = useSelector(state => state.message.messages)
  const dispatch = useDispatch()

  const { data: fetchedMessages, isLoading, error } = useQuery({
    queryKey: ['messages', categoryId],
    queryFn: () => {
      let url = categoryId ? `${MESSAGES_BY_CATEGORY_URL}/${categoryId}` : LATEST_MESSAGES_URL;
      return httpService.get(url);
    }
  });

  useEffect(() => {
    console.log(fetchedMessages);
    if (fetchedMessages) {
      dispatch(messageActions.loadMessages(fetchedMessages));
    }
  }, [fetchedMessages, dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // useEffect(() => {
  //   //! demo fetch, to be used only as demo, replace with react query.
  //   const getData = async () => {
  //     let url;
  //     if (!categoryId) {
  //       url = LATEST_MESSAGES_URL;
  //     } else {
  //       url = `${MESSAGES_BY_CATEGORY_URL}/${categoryId}`;
  //     }
  //     const response = await fetch(url);
  //     if (response.ok) {
  //       let json = await response.json();
  //       // setMessages(json.data);
  //       dispatch(messageActions.loadMessages(json.data))
  //     }
  //   };
  //   getData();
  // }, [categoryId]);

  return (
    <div className="flex flex-1 w-full bg-[#efefef]">
      {/* sidebar & content split side by side */}
      <Sidebar />
      <div className="w-full h-full">
        <Hero />
        {messages.length && <MessageList messages={fetchedMessages} />}
      </div>
    </div>
  );
};

export default Messages;
