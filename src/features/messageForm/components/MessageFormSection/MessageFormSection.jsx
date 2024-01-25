import React, { useEffect, useState } from "react";
import InputCmp from '@components/form/InputCmp/InputCmp'
import TextareaCmp from '@components/form/TextareaCmp/TextareaCmp'
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp"
import SelectCmp from "@components/form/SelectCmp/SelectCmp";
import CharsCount from "@components/ui/CharsCount/CharsCount";
import ErrorMessage from "@components/ui/ErrrorMessage/ErrorMessage";
import FileLinkSvg from "../../icons/FileLinkSvg";

// api url
import { MESSAGES_URL } from "@api/apiConstants.js";

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
    <form onSubmit={handleSubmit} className="grid justify-items-stretch">

      <SelectCmp name="categoryId" options={categories} onChange={handleChange} defaultOption="* קטגוריה"
        onBlur={validateForm} value={message.categoryId} containerStyle="relative mb-1 sm:w-fit" style="sm:w-[350px]" />

      <ErrorMessage msg={error.categoryId} style="h-[20px] mb-3" />

      <InputCmp name="title" placeholder="* כותרת" value={message?.title} onChange={handleChange}
        onBlur={validateForm} maxLength="25" inputStyle="w-full sm:w-[350px] mb-1"
        containerStyle="flex flex-col sm:w-fit"
      >
        <CharsCount currCount={message?.title?.length} total="25" style="relative self-end left-[15px] bottom-[35px]" />
      </InputCmp>

      <ErrorMessage msg={error.title} style="h-[20px] mb-3 relative bottom-[20px]" />

      <TextareaCmp name="text" placeholder="כתיבת הודעה..." value={message?.text} onChange={handleChange}
        rows="10" maxLength="350" style="w-full px-3 py-2"
        containerStyle="flex flex-col"
      >
        <CharsCount currCount={message?.text?.length} total="350" style="self-end relative left-[15px] bottom-[30px]" />
      </TextareaCmp>

      <InputCmp type="file" name="file" label="הוסף קובץ" message={message} onChange={handleChange}
        containerStyle="mb-4 flex flex-row-reverse justify-end items-center cursor-pointer"
        labelStyle="text-lg text-gray-400 underline underline-offset-4 mb-2 mr-2 cursor-pointer" inputStyle="hidden">
        <FileLinkSvg />
      </InputCmp>

      <div className="mb-5">* שדות המסומנים בכוכבית הם שדות חובה</div>

      <ButtonCmp label="שלח" style="w-full sm:w-[150px] justify-self-end p-2" isDisabled={isButtonDisabled} />
    </form>
  );
};

export default MessageFormSection;
