import React, { useState } from "react";
import MessageFormHeader from "../MessageFormHeader";
import MessageFormSection from "../MessageFormSection";
import ModalDialog from "@components/ui/ModalDialog/ModalDialog";

const MessageForm = ({ isModalOpen, toggleModal, categories }) => {
  const closeModal = () => {
    console.log('close');
    toggleModal(false);
  };
  return (
    <>
      <ModalDialog isOpen={isModalOpen} onClose={closeModal}>
        <div className="bg-[#EFEFEF] w-screen sm:w-auto p-8 rounded-3xl shadow-md ">
          <MessageFormHeader closeModal={closeModal} />
          <MessageFormSection categories={categories} closeModal={closeModal} />
        </div>
      </ModalDialog>
    </>
  );
};

export default MessageForm;
