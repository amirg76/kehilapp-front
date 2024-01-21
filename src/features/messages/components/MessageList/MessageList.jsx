import React from "react";
import MessagePreview from "../MessagePreview/MessagePreview";
import skeletonLoading from "@features/skeletonLoading/skeletonLoading";
//redux use functions
import { useDispatch, useSelector } from "react-redux";
//SkeletonLoading
import SkeletonLoading from "@features/skeletonLoading/SkeletonLoading";
const MessageList = ({ messages }) => {
  //TODO - what is the best practice to get the sender's name? from where should i send the request to the backend?
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading.active);
  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-3xl mr-10 mb-5 font-semibold opacity-75">
        הודעות הקיבוץ
      </h1>

      <div className="flex flex-wrap justify-center">
        {loading ? (
          <SkeletonLoading />
        ) : (
          messages &&
          messages.map((message) => (
            <MessagePreview
              key={message._id}
              message={message}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MessageList;
