import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
//components
import Sidebar from "@features/sidebar/components/Sidebar";
import MessageList from "@features/messages/components/MessageList";
import HeroSection from "../features/heroSection/components/HeroSection";
import LoadingPage from "@components/ui/LoadingPage/LoadingPage";
//redux
import { useDispatch, useSelector } from "react-redux";
import { messageActions } from "@store/slices/messageSlice";
import { userActions } from "@store/slices/userSlice";
import { categoryActions } from "@store/slices/categorySlice";

// api
import { httpService } from "../services/httpService";
import { CATEGORY_URL, MESSAGES_URL, USERS_URL } from "../api/apiConstants";
import useMessagesDisplay from "../hooks/useMessagesDisplay";

const Messages = () => {

  const { categoryId = "" } = useParams();
  const dispatch = useDispatch();

  const { data: fetchedMessages, isLoading, error } = useQuery({
    queryKey: ["messages", categoryId],
    queryFn: () => {
      return httpService.get(`${MESSAGES_URL}?categoryId=${categoryId}`);
    },
  });

  const { data: fetchedCategories, isLoading: isLoadingCategories, error: errorCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return httpService.get(CATEGORY_URL);
    },
  });

  const { data: fetchedUsers, isLoading: isLoadingUsers, error: errorUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return httpService.get(USERS_URL);
    },
  });

  useEffect(() => {
    if (fetchedMessages) {
      dispatch(messageActions.loadMessages(fetchedMessages));
    }
    if (fetchedCategories) {
      dispatch(categoryActions.loadCategories(fetchedCategories));
    }
    if (fetchedUsers) {
      dispatch(userActions.loadUsers(fetchedUsers));
    }
  }, [fetchedMessages, fetchedUsers, fetchedCategories, dispatch]);

  const messages = useSelector((state) => state.message.messages);
  const users = useSelector((state) => state.user.users);
  const categories = useSelector((state) => state.category.categories);

  const messagesToDisplay = useMessagesDisplay(messages, categories, users);

  return (
    <div className="flex flex-1 w-full bg-[#efefef]">
      {/* sidebar & content split side by side */}
      <Sidebar />
      <div className="w-full h-full">
        <HeroSection />
        {/* {isLoading && <LoadingPage />} */}
        {/* //TODO: add an error modal? */}
        {error && <p>Error: {error.message}</p>}
        {messagesToDisplay?.length ? (
          <MessageList messages={messagesToDisplay} isLoading={isLoading} />
        ) : (
          <div>לא נמצאו הודעות</div>
        )}
      </div>
    </div>
  );
};

export default Messages;
