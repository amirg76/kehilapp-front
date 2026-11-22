import React from "react";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";

const MessageFormHeader = ({ closeMessageModal }) => {
  
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl text-gray-600 dark:text-slate-200 font-semibold">כתיבת הודעה</h2>
      {/* Close Button. type="button": it is not inside the form, but the name
          is what a screen reader announces for an icon-only button. */}
      <ButtonCmp
        type="button"
        aria-label="סגירת החלון"
        className="text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-100 cursor-pointer mb-10 sm:mt-4 "
        onClick={closeMessageModal}
        label={
          <svg
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
          </svg>
        }
      />
    </div>
  );
};

export default MessageFormHeader;
