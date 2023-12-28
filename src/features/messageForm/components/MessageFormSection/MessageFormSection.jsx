import React, { useState } from "react";
import MessageFormSectionCategory from "../MessageFormSectionCategory/MessageFormSectionCategory";
import MessageFormSectionTextArea from "../MessageFormSectionTextArea/MessageFormSectionTextArea";
import MessageFormSectionFile from "../MessageFormSectionFile";
import MessageFormSectionSendButton from "../MessageFormSectionSendButton/MessageFormSectionSendButton";

const MessageFormSection = () => {
  const [formData, setFormData] = useState({
    category: "",
    content: "כתיבת הודעה...",
    imgLink: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted:", formData);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="grid justify-items-stretch "
    >
      <MessageFormSectionCategory />
      <MessageFormSectionTextArea
        handleChange={handleChange}
        formData={formData}
      />
      <MessageFormSectionFile
        handleChange={handleChange}
        formData={formData}
      />
      <MessageFormSectionSendButton />
    </form>
  );
};

export default MessageFormSection;
