import React from "react";
import MessagePreview from "../MessagePreview/MessagePreview";

const MessageList = ({ messages }) => {
  //TODO - what is the best practice to get the sender's name? from where should i send the request to the backend?
  return (

     
    
    <div className="mx-auto max-w-7xl">
    
      <h1 className="text-3xl mr-10 mb-5 font-semibold opacity-75">הודעות הקיבוץ</h1>


      <div className="flex flex-wrap justify-center">
        {messages &&
          messages.map((message) => (
            <MessagePreview
              key={message._id}
              message={message}
            />
          ))}
      </div>
    </div>
  );
};

export default MessageList;
