import { useState } from "react";

// ModalComponent.js
import { Dialog } from "@headlessui/react";

const ModalDialog = ({ isOpen, onClose, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50 "
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div
        className="fixed inset-0 bg-black/70 "
        aria-hidden="true"
      />

      {/* Full-screen container. It scrolls, and the inner box centres the panel
          only while it fits (min-h-full): a fixed flex container clipped a
          panel taller than the window, and on a short screen the message
          form's "שלח" sat below the edge with no way to reach it. */}
      {/* overflow-x-hidden: the message panel is w-screen. With a classic
          (non-overlay) scrollbar the container is 100vw minus the bar, so the
          panel would scroll sideways by a few px. Headless test browsers have
          overlay scrollbars, so no e2e test can see this; kept on review. */}
      <div className="fixed inset-0 overflow-y-auto overflow-x-hidden">
        <div className="flex min-h-full items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel className=" ">
            <Dialog.Title className=" ">{children}</Dialog.Title>
            {/* ... */}
          </Dialog.Panel>
        </div>
      </div>
      {/* Modal content goes here */}
    </Dialog>
  );
};

export default ModalDialog;
