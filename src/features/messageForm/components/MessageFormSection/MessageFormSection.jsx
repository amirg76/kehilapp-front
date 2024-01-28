import React, { useEffect, useState } from "react";
import InputCmp from "@components/form/InputCmp/InputCmp";
import TextareaCmp from "@components/form/TextareaCmp/TextareaCmp";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";
import SelectCmp from "@components/form/SelectCmp/SelectCmp";
import CharsCount from "@components/ui/CharsCount/CharsCount";
import ErrorMessage from "@components/ui/ErrrorMessage/ErrorMessage";
import LoadingPage from "@components/ui/LoadingPage/LoadingPage";
//redux
import { useDispatch } from "react-redux";
import { messageActions } from "@store/slices/messageSlice";
// api url
import { MESSAGES_URL } from "@api/apiConstants.js";

const MessageFormSection = ({ categories, closeModal }) => {
  const [message, setMessage] = useState({
    categoryId: "",
    senderId: "099",
    title: "",
    text: "",
    file: "",
  });
  const [error, setError] = useState({ title: null, categoryId: null });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setMessage({ ...message, [name]: value });
    validateForm(ev);
  };
  const handleFileInput = (e) => {
    setMessage({ ...message, file: e.target.files[0] });
  };

  useEffect(() => {
    setIsButtonDisabled(
      Object.values(error).some((value) => value?.length > 0 || value === null)
    );
  }, [error]);

  const handleSubmit = async (e) => {
    //loading
    setIsButtonDisabled(true);
    setIsLoading(true);

    e.preventDefault();
    //form data body
    let formData = new FormData();
    formData.append("categoryId", message.categoryId);
    formData.append("title", message.title);
    formData.append("text", message.text);
    formData.append("file", message.file);

    const response = await fetch(MESSAGES_URL, {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      let json = await response.json();
      //add new post to state
      dispatch(messageActions.saveMessage(json));
    }

    closeModal();
  };

  const validateForm = (ev) => {
    const { name, value } = ev.target;

    switch (name) {
      case "title":
        if (!value || value.length < 2 || value.length > 25) {
          setError((prevErrors) => ({
            ...prevErrors,
            title: "חובה לכתוב כותרת. אורכה יהיה בין 2-25 תווים",
          }));
        } else {
          setError((prevErrors) => ({ ...prevErrors, title: "" }));
        }
        break;
      case "categoryId":
        if (!value || value.length < 2 || value.length > 25) {
          setError((prevErrors) => ({
            ...prevErrors,
            categoryId: "חובה לבחור קטגוריה",
          }));
        } else {
          setError((prevErrors) => ({ ...prevErrors, categoryId: "" }));
        }
      default:
        break;
    }
  };

  // TODO: Change Loading page UI
  return (
    <>
      {isLoading ? (
        <LoadingPage />
      ) : (
        <form onSubmit={handleSubmit} className="grid justify-items-stretch">
          <SelectCmp
            name="categoryId"
            options={categories}
            onChange={handleChange}
            defaultOption="* קטגוריה"
            onBlur={validateForm}
            value={message.categoryId}
            containerStyle="relative mb-1 sm:w-fit"
            style="sm:w-[350px]"
          />

          <ErrorMessage msg={error.categoryId} style="h-[20px] mb-3" />

          <InputCmp
            name="title"
            placeholder="* כותרת"
            value={message?.title}
            onChange={handleChange}
            onBlur={validateForm}
            maxLength="25"
            inputStyle="w-full sm:w-[350px] mb-1"
            containerStyle="flex flex-col sm:w-fit"
          >
            <CharsCount
              currCount={message?.title?.length}
              total="25"
              style="relative self-end left-[15px] bottom-[35px]"
            />
          </InputCmp>

          <ErrorMessage
            msg={error.title}
            style="h-[20px] mb-3 relative bottom-[20px]"
          />

          <TextareaCmp
            name="text"
            placeholder="כתיבת הודעה..."
            value={message?.text}
            onChange={handleChange}
            rows="10"
            maxLength="350"
            style="w-full px-3 py-2"
            containerStyle="flex flex-col"
          >
            <CharsCount
              currCount={message?.text?.length}
              total="350"
              style="self-end relative left-[15px] bottom-[30px]"
            />
          </TextareaCmp>

          {/* <FileLinkSvg /> */}

          <InputCmp
            type="file"
            name="file"
            label="הוסף קובץ"
            inputStyle="ms-2 border-0"
            onChange={handleFileInput}
          />

          <h5 className="mb-5">* שדות המסומנים בכוכבית הם שדות חובה</h5>

          <ButtonCmp
            label="שלח"
            style="w-full sm:w-[150px] justify-self-end p-2"
            isDisabled={isButtonDisabled}
          />
        </form>
      )}
    </>
  );
};

export default MessageFormSection;
