import React from "react";
import MessagePreview from "../MessagePreview/MessagePreview";
//redux use functions
import { useSelector } from "react-redux";
//SkeletonLoading
import SkeletonLoading from "@components/ui/skeletonLoading/SkeletonLoading";

const MessageList = ({ messages, currentCategory, isLoading, onRemoveMessage }) => {
  //TODO - what is the best practice to get the sender's name? from where should i send the request to the backend?

  const SkeletonLoadingArray = Array.from({ length: 12 });

  return (
    <div className="mx-auto max-w-[1410px]">
      <div className="flex flex-wrap justify-center">
        {isLoading && SkeletonLoadingArray.map((_, i) => <SkeletonLoading key={i} />)}
        {messages.length ?
          messages.map((message) => (
            <MessagePreview key={message._id} message={message} onRemoveMessage={onRemoveMessage}/>
          )) :
          <div className="text-center">
            <div className="text-2xl font-semibold">לא נמצאו הודעות </div>
            {currentCategory && <div>בקטגוריה {currentCategory.title} </div>}
          </div>
        }
      </div>
    </div>
  );
};

export default MessageList;
