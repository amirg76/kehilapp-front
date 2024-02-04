import React from "react";
//components
import ImagePreview from "./ImagePreview";
import DocumentPreview from "./DocumentPreview";

const FilePreview = ({ attachmentType, attachmentUrl, attachmentName }) => {
  if (!attachmentType) {
    return (
      <ImagePreview
        imgSrc={"https://i.ibb.co/0mfdBtk/42243380990100408272no.jpg"}
        altDescription="category cover image"
      />
    );
  } else if (attachmentType.split("/")[0] === "image") {
    return (
      <ImagePreview
        imgSrc={attachmentUrl}
        altDescription="message cover image"
      />
    );
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
