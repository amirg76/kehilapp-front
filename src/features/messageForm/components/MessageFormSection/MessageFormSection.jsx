import React, { useState } from "react";
import MessageFormSectionCategory from "../MessageFormSectionCategory/MessageFormSectionCategory";
import MessageFormSectionTextArea from "../MessageFormSectionTextArea/MessageFormSectionTextArea";
import MessageFormSectionFile from "../MessageFormSectionFile";
import MessageFormSectionSendButton from "../MessageFormSectionSendButton/MessageFormSectionSendButton";
import MessageFormSectionTitle from "../MessageFormSectionTitle";
// api url
import { MESSAGES_URL } from "@api/apiConstants.js";

const MessageFormSection = ({ categories, closeModal }) => {
  const [formData, setFormData] = useState({
    categoryId: "",
    senderId: "099",
    title: "",
    text: "",
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
    const postData = async (formData) => {
      const response = await fetch(MESSAGES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        let json = await response.json();
        console.log("Post created:", json);
        // setMessages(json.data);
      }
    };
    postData(formData);
    closeModal();
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
        text={formData.text}
      />
      <MessageFormSectionCategory
        categories={categories}
        handleChange={handleChange}
        categoryId={formData.categoryId}
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
