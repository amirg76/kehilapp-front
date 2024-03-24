import React, { useEffect, useRef, useState } from "react";
//components
import Avatar from "@components/ui/Avatar/Avatar";
import CategoryTag from "../CategoryTag/CategoryTag";
import TextPreview from "../TextPreview/TextPreview";
import FilePreview from "../FilePreview/FilePreview";
import ButtonCmp from "@components/form/ButtonCmp";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";

//utils
import useFormattedDate from "../../../../hooks/useFormattedDate";

const MessagePreview = ({ message, onRemoveMessage }) => {
  const [isLongTextShown, setIsLongTextShown] = useState(false);
  const contentRef = useRef();
  const [containerHeight, setContainerHeight] = useState(0);
  const formattedDate = useFormattedDate(message.createdAt);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (contentRef.current) {
      setContainerHeight(contentRef.current.offsetHeight - 50);
    }
  }, [isLongTextShown, contentRef?.current?.offsetHeight]);

  const toggleLongText = () => {
    if (isLongTextShown) setIsLongTextShown(false);
    else setIsLongTextShown(true);
  };

  return (
    // <div
    //   className={`w-[436px] max-sm:w-full border-solid border border-black border-opacity-[0.1] rounded-[30px]
    //      bg-white shadow-0 shadow-md shadow-2 shadow-opacity-10 mx-6 my-10`}
    <div
      className={`w-[436px] max-sm:w-full border-solid border border-black border-opacity-[0.2] rounded-[30px]
            bg-white mx-4 my-10`}
      style={{
        height: `${containerHeight}px`,
        position: "relative",
        zIndex: "1",
      }}
    >
      {/* {!message.attachmentUrl && console.log(message.category.coverImgUrl)} */}
      <div
        className="flex flex-col p-[15px] relative bottom-[50px]"
        ref={contentRef}
      >
        <FilePreview
          attachmentType={message.attachmentType}
          attachmentUrl={
            message.attachmentUrl
              ? message.attachmentUrl
              : message.category.coverImgUrl
          }
          attachmentName={message.attachmentName}
        />

        <div className="flex flex-col flex-1 mt-[10px]">
          <h1 className="text-[20px] font-semibold mb-[2px]">
            {message.title}
          </h1>
          <TextPreview
            txt={message.text}
            isLongTxtShown={isLongTextShown}
            toggleLongText={toggleLongText}
            baseClasses="text-preview"
            expandedClasses="text-preview expanded"
          />
          <section className="flex items-center">
            <Avatar classes="ml-[17px]" />
            <h6 className="w-fit">
              <span className="font-semibold text-[18px]">
                {message.sender.firstName || "קיבוץ"}{" "}
                {message.sender.lastName || "כיסופים"}
              </span>
            </h6>
          </section>
          <div className="flex items-end justify-between">
            <section className="flex items-center w-fit">
              <h6 className="ml-[15px]">{formattedDate.date}</h6>
              <h6 className="font-light ml-[15px]">{formattedDate.time}</h6>
            </section>
            {isAuthenticated && (
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => onRemoveMessage(message._id)}
                className="cursor-pointer p-2 rounded-full bg-slate-200 hover:text-gray-600"
              />
            )}
            <CategoryTag
              category={{
                title: message.category.title,
                color: message.category.categoryColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePreview;
