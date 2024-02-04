import React, { useState } from "react";
//components
import ModalDialog from "@components/ui/ModalDialog/ModalDialog";

const ImagePreview = ({ imgSrc, altDescription }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <img
        className="rounded-[20px] h-[195px] object-cover cursor-pointer"
        src={imgSrc}
        alt={altDescription}
        onClick={() => {
          setIsModalOpen(true);
        }}
      />
      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <img src={imgSrc} alt={altDescription} className="mx-auto w-[80dvw]" />
      </ModalDialog>
    </>
  );
};

export default ImagePreview;