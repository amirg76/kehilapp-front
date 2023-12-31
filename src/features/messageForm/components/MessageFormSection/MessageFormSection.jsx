import React, { useState } from "react";
import MessageFormSectionCategory from "../MessageFormSectionCategory/MessageFormSectionCategory";
import MessageFormSectionTextArea from "../MessageFormSectionTextArea/MessageFormSectionTextArea";
import MessageFormSectionFile from "../MessageFormSectionFile";
import MessageFormSectionSendButton from "../MessageFormSectionSendButton/MessageFormSectionSendButton";
import MessageFormSectionTitle from "../MessageFormSectionTitle";

const MessageFormSection = ({ categories }) => {
  const [formData, setFormData] = useState({
    categorie: "",
    title: "",
    content: "",
    imgLink: "",
  });

  const handleChange = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);

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
      <MessageFormSectionTitle
        handleChange={handleChange}
        title={formData.title}
      />
      <MessageFormSectionTextArea
        handleChange={handleChange}
        content={formData.content}
      />
      <MessageFormSectionCategory
        categories={categories}
        handleChange={handleChange}
        categorie={formData.categorie}
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
