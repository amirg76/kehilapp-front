import React, { useState } from "react";
//components
import ModalDialog from "@components/ui/ModalDialog/ModalDialog";

const ImagePreview = ({ imgSrc, altDescription, attachmentUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openImgPopUp = () => {
    return !attachmentUrl && setIsModalOpen(true);
  };

  return (
    <>
      <img
        className="rounded-[20px] h-[195px] object-cover cursor-pointer shadow-0 shadow-md shadow-2 shadow-opacity-10] border-solid border border-black border-opacity-[0.1]"
        src={imgSrc}
        alt={altDescription}
        onClick={() => {
          openImgPopUp();
        }}
      />
      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <img
          src={imgSrc}
          alt={altDescription}
          className="mx-auto w-screen max-w-[100vw] sm:w-[80dvw]"
        />
      </ModalDialog>
    </>
  );
};

export default ImagePreview;


