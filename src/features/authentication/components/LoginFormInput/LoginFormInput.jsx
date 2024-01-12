import React from "react";

const LoginFormInput = ({ data, setData, inputName, inputType, text }) => {
  return (
    <div className="relative mb-8">
      <input
        id={inputName}
        name={inputName}
        type={inputType}
        className="w-full h-10 text-gray-900 placeholder-transparent border-b-2 border-gray-300 peer focus:outline-none focus:border-purple-600 "
        value={data}
        onChange={(e) => setData(e.target.value)}
        required
      />
      <label
        htmlFor={inputName}
        className="absolute right-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
      >
        {text}
      </label>
    </div>
  );
};

export default LoginFormInput;
