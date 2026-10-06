import React, { useState } from "react";

import Quill from "quill";
import MagicUrl from "quill-magic-url";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, { modules, formats } from "./EditorToolbar";

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
    setContent(e);
    onChange({ name, value: e });
  };

  return (
    <div className={`mb-10 xxs:mb-2 ${containerStyle}`}>
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
      {children}
    </div>
  );
};

export default TextareaCmp;
