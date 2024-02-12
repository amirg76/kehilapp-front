import React, { useState } from "react";
import MessageFormHeader from "../MessageFormHeader";
import MessageFormSection from "../MessageFormSection";
import ModalDialog from "@components/ui/ModalDialog/ModalDialog";

const MessageForm = ({ isModalOpen, toggleModal, categories }) => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoading = (boolean) => {
    setIsLoading(boolean);
  };

  const closeModal = () => {
    toggleModal(false);
  };
  //sm:w-[426px]
  return (
    <>
      <ModalDialog isOpen={isModalOpen} onClose={closeModal}>
        <div className="bg-[#EFEFEF] w-screen sm:w-[600px] h-[728px] p-8 sm:rounded-3xl shadow-md ">
          {!isLoading && <MessageFormHeader closeModal={closeModal} />}
          <MessageFormSection
            categories={categories}
            closeModal={closeModal}
            isLoading={isLoading}
            toggleLoading={toggleLoading}
          />
        </div>
      </ModalDialog>
    </>
  );
};

export default MessageForm;
