import React from "react";
//components
import ImagePreview from "./ImagePreview";
import DocumentPreview from "./DocumentPreview";
import PdfIcon from "@components/ui/PdfIcon/PdfIcon";

const FilePreview = ({ attachmentType, attachmentUrl, attachmentName }) => {
  // No file on the message: show the category cover image when we have one,
  // otherwise render nothing (the old code pointed at a dead external URL,
  // which rendered a broken-image box on every attachment-less message).
  if (!attachmentType) {
    if (!attachmentUrl) return <></>;
    return (
      <ImagePreview
        imgSrc={attachmentUrl}
        altDescription="תמונת קטגוריה"
        attachmentUrl={attachmentUrl}
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
        fileUrl={attachmentUrl}
        fileName={attachmentName}
        style="bg-[#facbc8]"
      >
        <PdfIcon />
      </DocumentPreview>
    );
  } else {
    return <></>;
  }
};

export default FilePreview;
