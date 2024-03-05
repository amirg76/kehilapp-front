import React, { useEffect, useState } from "react";
//cmps
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
import { httpService, queryClient } from "../../../../services/httpService";
import { useMutation } from "react-query";

const MessageFormSection = ({
  categories,
  closeModal,
  // isLoading,
  toggleLoading,
}) => {
  const [message, setMessage] = useState({
    categoryId: "",
    title: "",
    text: "",
    file: "",
  });

  const [error, setError] = useState({ title: null, categoryId: null });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const windowWidth = window.innerWidth;

  const dispatch = useDispatch();

  const handleChange = (ev) => {
    console.log(ev);
    const { name, value } = ev.target === undefined ? ev : ev.target;
    console.log("name:" + name, "value:" + value);

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
    toggleLoading(true);

    e.preventDefault();
    //form data body
    let formData = new FormData();
    formData.append("categoryId", message.categoryId);
    formData.append("title", message.title);
    formData.append("text", message.text);
    formData.append("file", message.file);

    setMessage(formData);
    mutate(formData);
  };

  const {
    mutate,
    isLoading: isPending,
    isError,
    error: errorMsg,
  } = useMutation({
    mutationFn: (formData) => httpService.post(MESSAGES_URL, formData),
    onSuccess: (data) => {
      console.log("success");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      dispatch(messageActions.saveMessage(data));
      toggleLoading(false);
      closeModal();
    },
  });

  const validateForm = (ev) => {
    const { name, value } = ev.target === undefined ? ev : ev.target;

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
      {isPending ? (
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

          <ErrorMessage msg={error.categoryId} style="h-[20px] mb-1" />

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
            style="h-[20px] mb-1 relative bottom-[20px]"
          />

          <TextareaCmp
            name="text"
            placeholder="כתיבת הודעה..."
            value={message?.text}
            onChange={handleChange}
            rows="10"
            // maxLength="1500"
            style="w-full h-64 mb-3 "
            containerStyle={"flex flex-col  bg-white"}
            // containerStyle={`flex flex-col ${
            //   windowWidth < 600 ? "space-y-14" : "space-y-8"
            // }  bg-white `}
          >
            <CharsCount
              currCount={message?.text?.length}
              total="1500"
              // style="self-end relative left-[15px] bottom-[30px]"
              style="self-end relative left-[15px]  "
            />
          </TextareaCmp>

          <InputCmp
            type="file"
            name="file"
            label="הוסף קובץ"
            inputStyle="ms-2 border-0"
            onChange={handleFileInput}
            accept="image/png,image/jpeg,application/pdf"
          />

          <h5 className="mb-1">* שדות המסומנים בכוכבית הם שדות חובה</h5>

          <ButtonCmp
            label="שלח"
            style="w-full sm:w-[150px] justify-self-end p-2 "
            isDisabled={isButtonDisabled}
          />
        </form>
      )}
    </>
  );
};

export default MessageFormSection;
