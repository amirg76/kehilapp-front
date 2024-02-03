import React from "react";

const DocumentPreview = ({ previewImgSrc, fileUrl, fileName }) => {
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
    <img
      className="rounded-[20px] h-[195px] object-cover"
      src={previewImgSrc}
      alt="cover for a downloadable file"
      onClick={handleShowFile}
    />
  );
};

export default DocumentPreview;
