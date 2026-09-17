import React, { Children } from "react";

const InputCmp = ({
  type = "text",
  label,
  labelStyle,
  name,
  value,
  onChange,
  placeholder,
  onBlur,
  inputStyle,
  maxLength,
  children,
  ...otherProps
}) => {
  // Destructuring here would not remove these from otherProps, and otherProps
  // is spread onto the <input> below -- so React was handed containerStyle and
  // onContainerClick as DOM attributes and warned about both on every form
  // render. Pull them out of the object instead of reading them off it.
  const { containerStyle, onContainerClick, ...inputProps } = otherProps;

  return (
    <div className={containerStyle} onClick={onContainerClick}>
      {label && (
        <label htmlFor={name} className={labelStyle}>
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border border-gray-300 bg-white text-gray-900 placeholder-gray-400 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600 dark:placeholder-slate-400 px-3 py-2 rounded-md focus:outline-none focus:border-primary-700 focus:ring-2 focus:ring-primary-500/60 dark:focus:border-primary-400 ${inputStyle}`}
        onBlur={onBlur}
        maxLength={maxLength}
        {...inputProps}
      />
      {children}
    </div>
  );
};

export default InputCmp;
