import React, { useEffect, useState } from "react";
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

  const [error, setError] = useState({ title: null, categoryId: null })
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)

  const handleChange = (ev) => {
    const { name, value } = ev.target
    setMessage({ ...message, [name]: value });
    validateForm(ev)
  };

  useEffect(() => {
    setIsButtonDisabled(Object.values(error).some(value => value?.length > 0 || value === null))
  }, [error])


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

  const validateForm = (ev) => {
    const { name, value } = ev.target

    switch (name) {
      case 'title':
        if (!value || value.length < 2 || value.length > 25) {
          setError(prevErrors => ({ ...prevErrors, title: 'חובה לכתוב כותרת. אורכה יהיה בין 2-25 תווים' }))
        } else {
          setError(prevErrors => ({ ...prevErrors, title: '' }))
        }
        break;
      case 'categoryId':
        if (!value || value.length < 2 || value.length > 25) {
          setError(prevErrors => ({ ...prevErrors, categoryId: 'חובה לבחור קטגוריה' }))
        } else {
          setError(prevErrors => ({ ...prevErrors, categoryId: '' }))
        }
      default:
        break;
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="grid justify-items-stretch">

      <SelectCmp name="categoryId" options={categories} onChange={handleChange} defaultOption="* קטגוריה"
        onBlur={validateForm} value={message.categoryId}
        containerStyle="relative w-1/2 mb-1" />

      <ErrorMessage msg={error.categoryId} style="h-[20px] mb-3" />

      <InputCmp name="title" placeholder="* כותרת" value={message.title} onChange={handleChange}
        onBlur={validateForm} inputStyle="w-1/2 mb-1" />

      <ErrorMessage msg={error.title} style="h-[20px] mb-3" />

      <TextareaCmp name="message-text" placeholder="כתיבת הודעה..."
        maxLength="250" rows="10" onChange={handleChange}
        style="w-full px-3 py-2" />

      <InputCmp type="file" name="file" label="הוסף קובץ" message={message} onChange={handleChange}
        children={<FileLinkSvg />} containerStyle="mb-4 flex flex-row-reverse justify-end items-center cursor-pointer"
        labelStyle="text-lg text-gray-400 underline underline-offset-4 mb-2 mr-2 cursor-pointer"
        inputStyle="hidden" />

      <div>* שדות המסומנים בכוכבית הם שדות חובה</div>

      <ButtonCmp label="שלח" style="w-1/5 justify-self-end p-2" isDisabled={isButtonDisabled} />
    </form>
  );
};

export default MessageFormSection;
