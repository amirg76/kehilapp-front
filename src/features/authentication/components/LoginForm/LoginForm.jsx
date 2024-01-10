//presentational component
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// import FormInput from "@components/form/FormInput";
// import Button from "@components/ui/Button";
import logoKisufim from "../img/logo-kibbuttz-transpert.png";
import { MESSAGES } from "@routes/routeConstants.js";

const LoginForm = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    setPassword("");
    setEmail("");
    event.preventDefault();

    onLogin(email, password);
  };
  useEffect(() => {
    console.log(email, password);
  }, []);

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
          {/* <div className="w-full  max-w-md px-8 py-14 bg-white rounded-2xl shadow-2xl"> */}
          <h1 className="text-3xl font-zen  mb-6">ברוך שובך</h1>
          <h2 className="text-xl font-bold mb-6">כניסה לחשבונך</h2>

          {/* Email Input */}
          <div className="relative mb-8">
            <input
              id="email"
              name="email"
              type="text"
              className="w-full h-10 text-gray-900 placeholder-transparent border-b-2 border-gray-300 peer focus:outline-none focus:border-purple-600 "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label
              htmlFor="email"
              className="absolute right-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              אימייל
            </label>
          </div>

          {/* Password Input */}
          <div className="relative mb-4">
            <input
              id="password"
              name="password"
              type="password"
              className="w-full h-10 text-gray-900 placeholder-transparent border-b-2 border-gray-300 peer focus:outline-none focus:border-purple-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label
              htmlFor="password"
              className="absolute right-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
            >
              סיסמא
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
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
