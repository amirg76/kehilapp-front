import React, { useState } from "react";
import MessageFormHeader from "../MessageFormHeader";
import MessageFormSection from "../MessageFormSection";

const MessageForm = () => {
  return (
    <div className="bg-[#EFEFEF] my-8 p-8 rounded-3xl shadow-md md:w-1/3">
      <MessageFormHeader />
      <MessageFormSection />
    </div>
  );
};

export default MessageForm;
