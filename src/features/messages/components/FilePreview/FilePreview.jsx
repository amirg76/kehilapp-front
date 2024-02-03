import React from "react";
//components
import ImagePreview from "./ImagePreview";
import DocumentPreview from "./DocumentPreview";

const FilePreview = ({ attachmentType, attachmentUrl, attachmentName }) => {
  if (attachmentType.split("/")[0] === "image") {
    return <ImagePreview imgSrc={attachmentUrl} />;
  } else if (attachmentType === "application/pdf") {
    return (
      <DocumentPreview
        previewImgSrc={"https://www.svgrepo.com/show/373961/pdf2.svg"}
        fileUrl={attachmentUrl}
        fileName={attachmentName}
      />
    );
  } else {
    return <></>;
  }
};

export default FilePreview;
