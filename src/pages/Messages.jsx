import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from 'react-query';

//components
import Sidebar from "@features/sidebar/components/Sidebar";
import MessageList from "../features/messages/components/MessageList";
import Hero from "../features/heroSection/components/Hero";
import { messageActions } from "../store/slices/messageSlice";
import { useDispatch, useSelector } from "react-redux"

// api url
import { httpService } from "../services/httpService";
import { MESSAGES_URL } from "../api/apiConstants";

const Messages = () => {
  const { categoryId } = useParams();
  const messages = useSelector(state => state.message.messages)
  const filterBy = useSelector(state => state.message.filterBy)
  const dispatch = useDispatch()

  const { data: fetchedMessages, isLoading, error } = useQuery({
    queryKey: ['messages', categoryId, filterBy],
    queryFn: () => {
      return httpService.get(`${MESSAGES_URL}?filterBy=${encodeURIComponent(JSON.stringify(filterBy))}`);
    }
  });

  useEffect(() => {
    console.log(fetchedMessages);
    if (fetchedMessages) {
      dispatch(messageActions.loadMessages(fetchedMessages));
    }
  }, [fetchedMessages, dispatch]);

  return (
    <div className="flex flex-1 w-full bg-[#efefef]">
      {/* sidebar & content split side by side */}
      <Sidebar />
      <div className="w-full h-full">
        <Hero />
        {/* //TODO: add a loader component */}
        {isLoading && <p>Loading...</p>}
        {/* //TODO: add an error modal? */}
        {error && <p>Error: {error.message}</p>}
        {messages?.length ? <MessageList messages={messages} /> : <div>לא נמצאו הודעות</div>}
      </div>
    </div>
  );
};

export default Messages;
