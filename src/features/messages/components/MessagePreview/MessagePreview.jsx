import React, { useEffect, useRef, useState } from "react";
import Avatar from "@components/ui/Avatar/Avatar";
import CategoryTag from "../CategoryTag/CategoryTag";
import TextPreview from "../TextPreview/TextPreview";

const MessagePreview = ({ message }) => {
  const [isLongTextShown, setIsLongTextShown] = useState(false);

  const contentRef = useRef();
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContainerHeight(contentRef.current.offsetHeight - 50);
    }
  }, [isLongTextShown]);

  const toggleLongText = () => {
    if (isLongTextShown) setIsLongTextShown(false);
    else setIsLongTextShown(true);
  };

  const { title, text } = message;
  let timestamp = message.createdAt.split("T");
  let date = timestamp[0];

  return (
    <div
      className={`w-[270px] max-sm:w-full border-solid border border-black border-opacity-[0.1] rounded-[30px]
         bg-white shadow-0 shadow-md shadow-2 shadow-opacity-10 mx-3 my-10`}
      style={{
        height: `${containerHeight}px`,
        position: "relative",
        zIndex: "1",
      }}
    >
      <div
        className="flex flex-col p-[15px] relative bottom-[50px]"
        ref={contentRef}
      >
        <img
          className="rounded-[10px] h-[195px] object-cover"
          src="https://i.ibb.co/0mfdBtk/42243380990100408272no.jpg"
          alt="demo-img"
        />
        <div className="flex flex-col flex-1 mt-[10px]">
          <h1 className="text-[20px] font-semibold mb-[2px]">{title}</h1>
          <TextPreview
            txt={text}
            isLongTxtShown={isLongTextShown}
            toggleLongText={toggleLongText}
            classes="font-light mb-[15px] flex-1"
          />
          <section className="flex items-center">
            <Avatar classes="ml-[17px]" />
            <h6 className="w-fit">
              מאת <span className="font-semibold text-[18px]">אורן קליין</span>
            </h6>
          </section>
          <div className="flex items-end justify-between">
            <section className="flex w-fit">
              <h6 className="ml-[15px]">{date}</h6>
              <h6 className="font-light">10:30</h6>
            </section>
            <CategoryTag category={{ title: "ראשי", color: "#A3CA62" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagePreview;
