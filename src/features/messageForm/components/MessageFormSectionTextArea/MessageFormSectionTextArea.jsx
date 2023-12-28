import React from "react";

const MessageFormSectionTextArea = ({ handleChange, formData }) => {
  return (
    <>
      {/* Text Area */}
      <div className="mb-0">
        <textarea
          id="content"
          name="content"
          onChange={handleChange}
          value={formData.content}
          maxLength="250"
          rows="10"
          className="w-full border border-gray-300 text-gray-400  px-3 py-2  rounded-md resize-none focus:outline-none focus:border-blue-500"
        ></textarea>
      </div>
    </>
  );
};

export default MessageFormSectionTextArea;
