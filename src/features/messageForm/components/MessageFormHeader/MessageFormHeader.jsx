import React from "react";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp"

const MessageFormHeader = ({ closeModal }) => {
  return (
    <div className="flex justify-between items-center ">
      <h2 className="text-2xl text-gray-500 font-semibold">כתיבת הודעה</h2>
      {/* Close Button */}
      <ButtonCmp className="text-gray-400 hover:text-gray-800 cursor-pointer mb-10 "
        onClick={closeModal}
        label={<svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>}
      />
    </div>
  );
};

export default MessageFormHeader;
