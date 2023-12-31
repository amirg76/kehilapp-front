import React from "react";

const MessageFormSectionTitle = ({ handleChange, title }) => {
  return (
    <>
      {/* Title  */}
      <div className="relative w-1/2 mb-5">
        <textarea
          id="title"
          name="title"
          onChange={handleChange}
          placeholder="כתיבת כותרת..."
          value={title}
          maxLength="20"
          rows="1"
          className="w-full border border-gray-300 text-gray-400  px-3 py-2  rounded-md resize-none focus:outline-none focus:border-blue-500"
        ></textarea>
      </div>
    </>
  );
};

export default MessageFormSectionTitle;
