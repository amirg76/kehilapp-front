import React from "react";
import MessagePreview from "../MessagePreview/MessagePreview";
//redux use functions
import { useSelector } from "react-redux";
//SkeletonLoading
import SkeletonLoading from "@components/ui/skeletonLoading/SkeletonLoading";

const MessageList = ({ messages, isLoading }) => {
  //TODO - what is the best practice to get the sender's name? from where should i send the request to the backend?

  const SkeletonLoadingArray = Array.from({ length: 12 });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-wrap justify-center">
        {isLoading
          ? SkeletonLoadingArray.map((_, i) => <SkeletonLoading key={i} />)
          : messages &&
            messages.map((message) => (
              <MessagePreview key={message._id} message={message} />
            ))}
      </div>
    </div>
  );
};

export default MessageList;
