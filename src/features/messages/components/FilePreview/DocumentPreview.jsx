import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const DocumentPreview = ({ fileUrl, fileName, children, style }) => {

  const handleShowFile = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", fileName);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");

    document.body.appendChild(link);
    link.click();
    // remove the created url after download
    URL.revokeObjectURL(link);
  };

  return (
    <div className={`rounded-[20px] h-[195px] object-cover cursor-pointer flex flex-col items-center justify-end
    shadow-0 shadow-md shadow-2 shadow-opacity-10] border-solid border border-black border-opacity-[0.1]
    ${style}`} onClick={handleShowFile}>
      {children}
      <div className="w-full px-3 bg-[#78777778] rounded-b-[20px] flex items-center">
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} style={{ color: "rgb(31, 41, 55)" }} className="ml-2" />
        <h6 className="leading-[40px] truncate">{fileName}</h6>
      </div>
    </div>
  );
};

export default DocumentPreview;
