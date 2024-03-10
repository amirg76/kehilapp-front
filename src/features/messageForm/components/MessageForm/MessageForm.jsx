import React, { useState } from "react";
import MessageFormHeader from "../MessageFormHeader";
import MessageFormSection from "../MessageFormSection";
import ModalDialog from "@components/ui/ModalDialog/ModalDialog";

const MessageForm = ({ isModalOpen, toggleModal, categories }) => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleLoading = (boolean) => {
    setIsLoading(boolean);
  };

  const closeMessageModal = () => {
    toggleModal(false);
  };
  //sm:w-[426px]
  return (
    <>
      <ModalDialog isOpen={isModalOpen} onClose={closeMessageModal}>
        <div className="bg-[#EFEFEF] w-screen sm:w-[700px] h-[100vh] sm:h-[90vh] xxs:h-fit p-8 sm:rounded-3xl shadow-md ">
          {!isLoading && <MessageFormHeader closeMessageModal={closeMessageModal} />}
          <MessageFormSection
            categories={categories}
            closeMessageModal={closeMessageModal}
            isLoading={isLoading}
            toggleLoading={toggleLoading}
          />
        </div>
      </ModalDialog>
    </>
  );
};

export default MessageForm;
