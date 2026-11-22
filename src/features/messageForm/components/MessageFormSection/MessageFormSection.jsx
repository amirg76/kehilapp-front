import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//cmps
import InputCmp from "@components/form/InputCmp/InputCmp";
import TextareaCmp from "@components/form/TextareaCmp/TextareaCmp";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";
import SelectCmp from "@components/form/SelectCmp/SelectCmp";
import CharsCount from "@components/ui/CharsCount/CharsCount";
import ErrorMessage from "@components/ui/ErrorMessage/ErrorMessage";
import LoadingPage from "@components/ui/LoadingPage/LoadingPage";
//redux
import { messageActions } from "@store/slices/messageSlice";
import { useDispatch } from "react-redux";
import { uiActions } from "@store/slices/uiSlice";
// api url
import { MESSAGES_URL } from "@api/apiConstants.js";
import { httpService, queryClient } from "../../../../services/httpService";
import { useMutation } from "react-query";
import { labelText } from "@utils/bidiText";

const FIELD_LABEL = "mb-1 text-sm font-medium text-gray-700 dark:text-slate-200";

const MessageFormSection = ({
  categories,
  closeMessageModal,
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
  const navigate = useNavigate()

  const handleChange = (ev) => {
    const { name, value } = ev.target === undefined ? ev : ev.target;
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

  // What is still missing, named, for the line under a disabled "שלח". The
  // same two rules validateForm enforces; nothing here decides whether the
  // button is enabled.
  const missing = [];
  if (!message.categoryId) missing.push("לבחור קטגוריה");
  const titleLength = message.title?.length || 0;
  if (titleLength < 2 || titleLength > 25) {
    // nowrap: a phone broke the line after the dash, "(2–" / "25 תווים)".
    missing.push(<>לכתוב כותרת <span className="whitespace-nowrap">(2–25 תווים)</span></>);
  }
  const submitHint =
    isButtonDisabled && missing.length > 0 ? (
      <>
        כדי לשלוח צריך{" "}
        {missing.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && " ו"}
            {item}
          </React.Fragment>
        ))}
        .
      </>
    ) : null;

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
    // Only when a file was chosen: appending the initial "" (or undefined)
    // sends the literal string "undefined" as the file field.
    if (message.file) {
      formData.append("file", message.file);
    }

    // `message` must stay the form's own state object. It used to be replaced
    // with the FormData here, which was harmless on success (the modal closes)
    // but on error blanked every controlled field when the form came back.
    mutate(formData);
  };

  const {
    mutate,
    isLoading: isPending,
    isError,
    error: errorMsg,
  } = useMutation({
    mutationFn: (formData) => httpService.post(MESSAGES_URL, formData),
    onSuccess: (data) => onMessageSent(data),
    onError: () => onMessageFailed(),
  });

  // The modal stays open with the typed text intact so the user can retry.
  // The file is dropped on purpose: the form subtree unmounts while pending,
  // so the file input comes back empty and keeping the File in state would
  // silently resend the attachment that just failed.
  const onMessageFailed = () => {
    setMessage((prev) => ({ ...prev, file: "" }));
    setIsButtonDisabled(false);
    toggleLoading(false);
  };

  const onMessageSent = (data) => {
    queryClient.invalidateQueries({ queryKey: ["messages"] });
    dispatch(messageActions.saveMessage(data));
    toggleLoading(false);
    closeMessageModal();
    onCloseNavbar();
    navigate(`/messages/${message.categoryId}`)
  }

  const onCloseNavbar = () => {
    dispatch(uiActions.closeModal());
  };

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
      break; // was fall-through — default is a no-op, so behavior is unchanged
      default:
        break;
    }
  };

  return (
    <>
      {/* Always mounted, outside the pending/form switch: a live region that is
          created together with its message is usually not announced by screen
          readers (merge gate, 29.10). Fixed wording on purpose: the server's
          error text may be English or internal, and a 500 from a failed upload
          must still tell the user what to do. */}
      <div role="alert">
        <ErrorMessage
          msg={
            isError
              ? "שליחת ההודעה נכשלה. נסו שוב; אם צירפתם קובץ, הוא הוסר מהטופס — נסו לשלוח בלי הקובץ או לצרף אותו מחדש."
              : ""
          }
          style="mb-2"
        />
      </div>

      {isPending ? (
        <LoadingPage />
      ) : (
        <form onSubmit={handleSubmit} className="grid justify-items-stretch">
          {/* Visible labels: the placeholder used to be the only name, and it
              disappears as soon as the field has a value. The placeholders
              say something else, so they do not repeat the label. */}
          <SelectCmp
            name="categoryId"
            label="קטגוריה *"
            labelStyle={FIELD_LABEL}
            options={categories}
            onChange={handleChange}
            defaultOption="בחירת קטגוריה"
            onBlur={validateForm}
            value={message.categoryId}
            containerStyle="mb-1"
          />

          <ErrorMessage msg={error.categoryId} style="h-[20px] mb-1" />

          <InputCmp
            name="title"
            label="כותרת *"
            labelStyle={FIELD_LABEL}
            placeholder="עד 25 תווים"
            value={message?.title}
            onChange={handleChange}
            onBlur={validateForm}
            maxLength="25"
            inputStyle="w-full mb-1"
            containerStyle="flex flex-col"
          >
            <CharsCount
              currCount={message?.title?.length}
              total="25"
              style="relative self-end left-[15px] bottom-[35px]"
            />
          </InputCmp>

          <ErrorMessage
            msg={error.title}
            style="sm:h-[20px] mb-1 relative bottom-[20px]"
          />

          <TextareaCmp
            name="text"
            placeholder="כתיבת הודעה…"
            value={message?.text}
            onChange={handleChange}
            rows="10"
            // maxLength="1500"
            style="w-full sm:h-64 sm:mb-3 h-[20vh] "
            containerStyle={"flex flex-col"}
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

          {/* The browser draws a file input's button and its "No file chosen"
              in the browser's language, and no CSS can translate them. The
              input stays (keyboard, screen readers and the picker all work
              through it) but is visually hidden; the label is the button,
              and the chosen name is printed in Hebrew next to it. */}
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <input
              id="file"
              type="file"
              name="file"
              className="peer sr-only"
              onChange={handleFileInput}
              accept="image/png,image/jpeg,application/pdf"
              aria-describedby="file-chosen file-hint"
            />
            <label
              htmlFor="file"
              className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 hover:bg-gray-50 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            >
              צירוף קובץ
            </label>
            {/* A file's name is the user's own, but it is still shown as
                text only, with direction controls removed (bidiText.js). */}
            <span id="file-chosen" dir="auto" className="min-w-0 truncate text-sm text-gray-700 dark:text-slate-300">
              {message.file ? labelText(message.file.name) : "לא נבחר קובץ"}
            </span>
            <span id="file-hint" className="w-full text-sm text-gray-600 dark:text-slate-400">
              תמונה (PNG, JPG) או PDF
            </span>
          </div>

          <h5 className="mb-1 text-gray-700 dark:text-slate-300">* שדות המסומנים בכוכבית הם שדות חובה</h5>

          <ButtonCmp
            data-testid="message-submit-button"
            label="שלח"
            style="w-full sm:w-[150px] justify-self-end p-2 "
            isDisabled={isButtonDisabled}
            aria-describedby={submitHint ? "message-submit-hint" : undefined}
          />
          {/* A disabled button says nothing about why. */}
          {submitHint && (
            <p id="message-submit-hint" className="mt-1 justify-self-end text-sm text-gray-700 dark:text-slate-300">
              {submitHint}
            </p>
          )}
        </form>
      )}
    </>
  );
};

export default MessageFormSection;
