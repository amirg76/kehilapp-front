import React, { useEffect, useState } from "react";
import logoKisufim from "../img/logo-kibbuttz-transpert.png";
import LoginFormInput from "../LoginFormInput/LoginFormInput";

const LoginForm = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    setPassword("");
    setEmail("");
    event.preventDefault();

    onLogin(email, password);
  };

  return (
    <>
      {/* Login Form on the Right */}
      <div className="flex flex-col items-center md:w-1/2">
        <img
          className="object-cover w-[15em] h-[8em] my-10"
          src={logoKisufim}
          alt="Your Company"
        />
        {/* Login Form */}
        <form
          className="w-full  max-w-md px-8 py-14 bg-white rounded-2xl shadow-2xl"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-zen  mb-6">ברוך שובך</h1>
          <h2 className="text-xl font-bold mb-6">כניסה לחשבונך</h2>

          {/* Email Input */}
          <LoginFormInput
            data={email}
            setData={setEmail}
            inputName="email"
            inputType="text"
            text="אימייל"
          />

          {/* Password Input */}
          <LoginFormInput
            data={password}
            setData={setPassword}
            inputName="password"
            inputType="password"
            text="סיסמא"
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
            onSubmit={handleSubmit}
          >
            כניסה לחשבון
          </button>
          {/* </div> */}
        </form>
      </div>
      {/* <div> */}
      {/* <FormInput
          label="Username"
          value={username}
          onInputChange={setUsername}
          type="text"
          id="username"
          placeholder="Enter your username"
          autoComplete="username"
        />
      </div>
      <div>
        <FormInput
          label="password"
          value={password}
          onInputChange={setPassword}
          type="password"
          id="password"
          placeholder="Enter your password"
          autoComplete="current-password"
        /> */}
      {/* </div> */}
      {/* <Button type="submit">Login</Button> */}
    </>
  );
};

export default LoginForm;
