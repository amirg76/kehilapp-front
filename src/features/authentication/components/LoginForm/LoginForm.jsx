import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// redux
import { authActions } from "@store/slices/authSlice";
import { useDispatch } from "react-redux";

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
  const [error, setError] = useState({
    email: null,
    password: null
  })
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsButtonDisabled(
      Object.values(error).some((value) => value?.length > 0 || value === null)
    );
  }, [error]);

  const handleChange = (ev) => {
    const { name, value } = ev.target
    setUserCredentials({ ...userCredentials, [name]: value })
    validateForm(ev);
  };

  const validateForm = (ev) => {
    const { name, value } = ev.target
    // console.log('validate', name, value);
    switch (name) {
      case "email":
        if (!value || !value.length) {
          setError((prevErrors) => ({ ...prevErrors, email: "שדה חובה" }));
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          setError((prevErrors) => ({ ...prevErrors, email: "כתובת המייל אינה תקינה" }))
        } else {
          setError((prevErrors) => ({ ...prevErrors, email: "" }));
        }
        break;
      case "password":
        if (!value || !value.length) {
          setError((prevErrors) => ({ ...prevErrors, password: "שדה חובה" }));
        } else if (!/^.{8,20}$/.test(value)) {
          setError((prevErrors) => ({ ...prevErrors, password: "הסיסמא צריכה להיות באורך של 8 תווים לפחות" }));
        }
        //OPTIONAL
        // else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,20}$/.test(value)) {
        //   setError((prevErrors) => ({ ...prevErrors, password: "הסיסמא צריכה להכיל לפחות מספר אחד, אות גדולה אחת ואות קטנה אחת" }));
        // } 
        else {
          setError((prevErrors) => ({ ...prevErrors, password: "" }));
        }
      default:
        break;
    }
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
        <img className="object-cover w-[15em] h-[8em] my-10" src={logoKisufim} alt="Your Company" />
        {/* Login Form */}
        <form
          className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="mb-3">ברוך שובך!</h1>
          <h2 className="text-xl font-bold mb-6">כניסה לחשבונך</h2>

          <InputCmp label="אימייל" name="email" value={userCredentials.email}
            onChange={handleChange} onBlur={validateForm} inputStyle="py-3"
            containerStyle="flex flex-col" labelStyle="relative w-fit bg-white top-[10px] right-[10px] px-2" />
          <ErrorMessage msg={error.email} style="h-[20px]  mr-3" />
          <InputCmp label="סיסמא" type="password" name="password" value={userCredentials.password}
            onChange={handleChange} onBlur={validateForm} inputStyle="py-3"
            containerStyle="flex flex-col" labelStyle="relative w-fit bg-white top-[10px] right-[10px] px-2" />
          <ErrorMessage msg={error.password} style="h-[20px] mb-6 mr-3" />
          <ButtonCmp label="כניסה לחשבון" isDisabled={isButtonDisabled} onClick={handleSubmit} style="w-full py-3" />

        </form>
      </div>
    </>
  );
};

export default LoginForm;
