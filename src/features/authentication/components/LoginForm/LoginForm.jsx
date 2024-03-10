import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// redux
import { uiActions } from "@store/slices/uiSlice";
import { authActions } from "@store/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";

import logoKisufim from "../img/logo-kibbuttz-transpert.png";

import InputCmp from "@components/form/InputCmp/InputCmp";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";
import ErrorMessage from "@components/ui/ErrorMessage";

const LoginForm = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userCredentials, setUserCredentials] = useState({
    email: '',
    password: ''
  })

  const handleChange = ({ target }) => {
    const { name, value } = target
    setUserCredentials({ ...userCredentials, [name]: value })
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    //* Simulate authentication logic (replace with your actual authentication logic)
    const { email, password } = userCredentials
    if (email === "user@example.com" && password === "user@example.com") {
      // Set user information in local storage
      const user = { id: 1, name: "ישראל ישראלי" };
      localStorage.setItem("token", "exampleToken");
      localStorage.setItem("user", JSON.stringify(user));
      // Dispatch the login action with user information
      dispatch(authActions.login(user));
      // Navigate to main page
      navigate("/messages");
    } else {
      console.log("wrong credentials");
    }
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
          className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="mb-3">ברוך שובך</h1>
          <h2 className="text-xl font-bold mb-10">כניסה לחשבונך</h2>

          <InputCmp label="אימייל" name="email" value={userCredentials.email} onChange={handleChange} containerStyle="flex flex-col mb-4"/>
          <ErrorMessage msg="" style=""/>
          <InputCmp label="סיסמא" type="password" name="password" value={userCredentials.password} onChange={handleChange} containerStyle="flex flex-col mb-4"/>
          <ErrorMessage msg="" style=""/>
          <ButtonCmp label="כניסה לחשבון" onClick={handleSubmit} style="w-full py-3"/>

        </form>
      </div>
    </>
  );
};

export default LoginForm;
