import React, { Children, useState } from "react";

import Quill from "quill";
import MagicUrl from "quill-magic-url";
//-----------------//
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, { modules, formats } from "./EditorToolbar";

// const modules = {
//   toolbar: [
//     [{ header: [1, 2, false] }, { font: [] }],
//     ["bold", "italic", "underline", "strike", "blockquote"],
//     [
//       { list: "ordered" },
//       { list: "bullet" },
//       { indent: "-1" },
//       { indent: "+1" },
//     ],
//     ["link", "image"],
//     ["clean"],
//     // [{ direction: "rtl" }], // this is rtl support
//   ],
//   magicUrl: true,
// };

// const formats = [
//   "header",
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "blockquote",
//   "list",
//   "bullet",
//   "indent",
//   "link",
//   "image",
// ];

Quill.register("modules/magicUrl", MagicUrl);

const TextareaCmp = ({
  label,
  labelStyle,
  name,
  value,
  onChange,
  placeholder,
  style,
  maxLength,
  rows,
  children,
  ...otherProps
}) => {
  const { containerStyle } = otherProps;
  const [content, setContent] = useState("");

  const handleChange = (e) => {
    console.log("name:" + name, "value:" + e);
    setContent(e);
    onChange({ name, value: e });
  };

  return (
    <div className={`mb-10 ${containerStyle}`}>
      {label && (
        <label htmlFor={name} className={labelStyle}>
          {label}
        </label>
      )}
      <EditorToolbar />
      <ReactQuill
        theme="snow"
        name={name}
        value={content}
        placeholder={placeholder}
        onChange={handleChange}
        className={` border-gray-300 rounded-md resize-none focus:outline-none focus:border-primary-700  ${style} `}
        maxLength={maxLength}
        modules={modules}
        formats={formats}
      />

      {/* <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
      <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}
      {/* <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border border-gray-300 rounded-md resize-none focus:outline-none focus:border-primary-700 ${style}`}
        maxLength={maxLength}
        rows={rows}
        {...otherProps}
      /> */}
      {children}
    </div>
  );
};

export default TextareaCmp;
