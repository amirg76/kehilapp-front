import React from "react";

const MessageFormSectionSendButton = () => {
  return (
    <>
      {/* Send Button */}
      <button
        type="submit"
        className="w-1/5 bg-blue-500 text-xl justify-self-end font-medium text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none"
      >
        שלח
      </button>
    </>
  );
};

export default MessageFormSectionSendButton;
