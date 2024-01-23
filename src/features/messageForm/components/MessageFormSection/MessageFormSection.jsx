import React, { useState } from "react";
import MessageFormSectionCategory from "../MessageFormSectionCategory/MessageFormSectionCategory";
import InputCmp from '@components/form/InputCmp/InputCmp'
import TextareaCmp from '@components/form/TextareaCmp/TextareaCmp'
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp"
import SelectCmp from "@components/form/SelectCmp/SelectCmp";
import FileLinkSvg from "../../icons/FileLinkSvg";

// api url
import { MESSAGES_URL } from "@api/apiConstants.js";
import ErrorMessage from "../../../../components/ui/ErrrorMessage/ErrorMessage";

const MessageFormSection = ({ categories, closeModal }) => {

  const [message, setMessage] = useState({
    categoryId: "",
    senderId: "099",
    title: "",
    text: "",
  });

  const [error, setError] = useState({})

  const handleChange = (ev) => {
    const { name, value } = ev.target
    setMessage({ ...message, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted:", message);

    const postData = async (message) => {
      const response = await fetch(MESSAGES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      if (response.ok) {
        let json = await response.json();
        console.log("Post created:", json);
        // setMessages(json.data);
      }
    };
    postData(message);
    closeModal();
  };

  const validateForm = (formData) => {
    const errors = {};

    // Title validation
    if (!formData.title || formData.title.length < 2 || formData.title.length > 25) {
      errors.title = 'חובה לכתוב כותרת. אורכה יהיה בין 2-25 תווים';
    }

    // Text validation
    if (formData.text && formData.text.length > 250) {
      errors.text = 'הטקסט מכיל לכל היותר כ-250 תווים';
    }

    // Category validation
    if (!formData.category) {
      errors.category = 'חובה לבחור קטגוריה';
    }

    setError(errors)
    return errors;
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="grid justify-items-stretch "
    >

      <SelectCmp options={categories} onChange={handleChange} defaultOption="קטגוריה" containerStyle="relative w-1/2 mb-5" />
      <ErrorMessage msg={error.category} />
      <InputCmp name="title" placeholder="כותרת" value={message.title} onChange={handleChange}
        inputStyle="w-1/2 px-3 py-2 mb-5" />
      <ErrorMessage msg={error.title} />
      <TextareaCmp name="message-text" placeholder="כתיבת הודעה..."
        maxLength="250" rows="10" onChange={handleChange}
        style="w-full px-3 py-2" />

      <InputCmp type="file" name="file" label="הוסף קובץ" message={message} onChange={handleChange}
        children={<FileLinkSvg />} containerStyle="mb-4 flex flex-row-reverse justify-end items-center cursor-pointer"
        labelStyle="text-lg text-gray-400 underline underline-offset-4 mb-2 mr-2 cursor-pointer"
        inputStyle="hidden" />

      <ButtonCmp label="שלח" style="w-1/5 justify-self-end p-2" isDisabled={Object.keys(error).length === 0}/>
    </form>
  );
};

export default MessageFormSection;
