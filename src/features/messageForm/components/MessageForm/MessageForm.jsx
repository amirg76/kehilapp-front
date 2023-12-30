import React, { useState } from "react";
import MessageFormHeader from "../MessageFormHeader";
import MessageFormSection from "../MessageFormSection";
import ModalDialog from "../../../../components/ui/ModalDialog/ModalDialog";

const MessageForm = ({ isModalOpen, setIsModalOpen }) => {
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <ModalDialog
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <div className="bg-[#EFEFEF] my-8 p-8 rounded-3xl shadow-md mx-5 xs:mx-14 lg:mx-0 lg:max-w-screen-md ">
          <MessageFormHeader closeModal={closeModal} />
          <MessageFormSection />
        </div>
      </ModalDialog>
    </>
  );
};

export default MessageForm;
