import React from "react";
import MessagePreview from "../MessagePreview/MessagePreview";

//redux use functions
import { useSelector } from "react-redux";
//SkeletonLoading
import SkeletonLoading from "@components/ui/skeletonLoading/SkeletonLoading";
const MessageList = ({ messages }) => {
  //TODO - what is the best practice to get the sender's name? from where should i send the request to the backend?

  const loading = useSelector((state) => state.loading.active);

  const SkeletonLoadingArray = Array.from({ length: 12 });
  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-3xl mr-10 mb-5 font-semibold opacity-75">
        הודעות הקיבוץ
      </h1>
    
      <div className="flex flex-wrap justify-center">
        {loading
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
