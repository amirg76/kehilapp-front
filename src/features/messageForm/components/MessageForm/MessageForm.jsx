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
        {/* The panel needs its own dark colours: the fields inside it already
            had dark: variants, so in dark mode they turned dark on a light
            panel (seen 22.11.2026). */}
        <div className="bg-[#EFEFEF] dark:bg-slate-800 text-gray-900 dark:text-slate-100 w-screen sm:w-[700px] h-[100vh] xxs:h-fit p-8 sm:rounded-3xl shadow-md ">
          {!isLoading && (
            <MessageFormHeader closeMessageModal={closeMessageModal} />
          )}
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
