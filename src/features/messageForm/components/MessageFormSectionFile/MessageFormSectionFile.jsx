import React from "react";
import FileLinkSvg from "../../icons/FileLinkSvg";
const MessageFormSectionFile = ({ handleChange, formData }) => {
  return (
    <>
      {/* File Link */}
      <div className="mb-4 flex items-center pr-3">
        <FileLinkSvg />
        <p className="block pr-3 text-lg text-gray-400 underline underline-offset-4   mb-2">
          הוסף קובץ
        </p>

        <div className="flex items-center"></div>
      </div>
    </>
  );
};

export default MessageFormSectionFile;
