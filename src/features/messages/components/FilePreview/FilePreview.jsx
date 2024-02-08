import React from "react";
//components
import ImagePreview from "./ImagePreview";
import DocumentPreview from "./DocumentPreview";
import PdfIcon from "@components/ui/PdfIcon/PdfIcon";

const FilePreview = ({ attachmentType, attachmentUrl, attachmentName }) => {
  if (!attachmentType) {
    return (
      <ImagePreview
        imgSrc={
          attachmentUrl
            ? attachmentUrl
            : "https://i.ibb.co/0mfdBtk/42243380990100408272no.jpg"
        }
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
