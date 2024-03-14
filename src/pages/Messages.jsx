import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
//components
import Sidebar from "@features/sidebar/components/Sidebar";
import MessageList from "@features/messages/components/MessageList";
import HeroSection from "../features/heroSection/components/HeroSection";
import LoadingPage from "@components/ui/LoadingPage/LoadingPage";
import SearchMessages from "@features/searchMessages/components/SearchMessages/SearchMessages";

//redux
import { useDispatch, useSelector } from "react-redux";
import { messageActions } from "@store/slices/messageSlice";
import { userActions } from "@store/slices/userSlice";
import { categoryActions } from "@store/slices/categorySlice";

// api
import { httpService, queryClient } from "../services/httpService";
import { CATEGORY_URL, MESSAGES_URL, USERS_URL } from "../api/apiConstants";
import useMessagesDisplay from "../hooks/useMessagesDisplay";
import SkeletonLoading from "../components/ui/skeletonLoading/SkeletonLoading";

const Messages = () => {
  const { categoryId = "" } = useParams();
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages);
  const users = useSelector((state) => state.user.users);
  const categories = useSelector((state) => state.category.categories);
  const isModalOpen = useSelector((state) => state.ui.isModalOpen);
  const messagesToDisplay = useMessagesDisplay(messages, categories, users);

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

  const { data: currentCategory, isLoading: isLoadingCategory, error: errorCategory } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => {
      return httpService.get(`${CATEGORY_URL}/${categoryId}`);
    },
  });

  const { data: fetchedUsers, isLoading: isLoadingUsers, error: errorUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return httpService.get(USERS_URL);
    },
  });

  const { mutate, isLoading: isPending, isError, error: errorMsg } = useMutation({
    mutationFn: (messageId) => httpService.delete(`${MESSAGES_URL}/${messageId}`),
    onSuccess: (messageId) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      dispatch(messageActions.removeMessage(messageId));
    },
    onError: () => { }
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

  const onRemoveMessage = (messageId) => {
    mutate(messageId)
  }

  return (
    <div className="flex flex-1 w-full bg-[#efefef] msgs-container-height">
      {/* sidebar & content split side by side */}
      <Sidebar />
      <div className="w-full h-full">
        <HeroSection />
        {!isModalOpen && <SearchMessages />}
        {/* {isLoading && <LoadingPage />} */}
        {/* //TODO: add an error modal? */}
        {error && <p>Error: {error.message}</p>}
        <MessageList messages={messagesToDisplay} currentCategory={currentCategory} isLoading={isLoading} onRemoveMessage={onRemoveMessage} />
      </div>
    </div>
  );
};

export default Messages;
