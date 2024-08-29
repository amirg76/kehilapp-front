import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// redux
import { authActions } from "@store/slices/authSlice";
import { useDispatch } from "react-redux";

import logoKisufim from "../img/logo-kibbuttz-transpert.png";

import InputCmp from "@components/form/InputCmp/InputCmp";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";
import ErrorMessage from "@components/ui/ErrorMessage";

import { LOGIN_URL } from "@api/apiConstants";
import { httpService, queryClient } from "@services/httpService";
import { useMutation } from "react-query";

import Spinner from "@ui/Spinner/Spinner";

// routeConstants
import { MESSAGES } from "@routes/routeConstants";
import validateEmail from "@hooks/validateEmail";
import validatePassword from "@hooks/validatePassword";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: null,
    password: null,
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loginErrorMessage, setLoginErrorMessage] = useState("");

  useEffect(() => {
    /**
     * Updates the button's disabled state based on the presence of errors.
     *
     * @description Checks if any error messages exist and updates the button's disabled state accordingly.
     * @param {object} error - The object containing error messages.
     * @return {void}
     */
    setIsButtonDisabled(
      Object.values(error).some((value) => value?.length > 0 || value === null)
    );
  }, [error]);

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setUserCredentials({ ...userCredentials, [name]: value });
    validateForm(ev);
  };
  /**
   * Validates a form field based on the provided event.
   *
   * @param {object} ev - The event object containing the target element's name and value.
   * @return {void}
   */
  const validateForm = (ev) => {
    const { name, value } = ev.target;
    const errorMessages = {
      email: validateEmail(value),
      password: validatePassword(value),
    };
    setError((prevErrors) => ({ ...prevErrors, [name]: errorMessages[name] }));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    mutate();
  };

  const {
    mutate,
    isLoading,
    isError,
    error: loginError,
  } = useMutation({
    mutationFn: () => httpService.post(LOGIN_URL, userCredentials),
    onSuccess: (user) => onUserLoggedIn(user),
    onError: (err) => updateErrorMessage(err),
  });

  const onUserLoggedIn = (user) => {
    console.log(user);
    // Set user information in session storage
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    // Dispatch the login action with user information
    dispatch(authActions.login(user));
    // Navigate to main page
    navigate(MESSAGES);
  };

  const updateErrorMessage = (err) => {
    if (err.response.status === 401)
      setLoginErrorMessage("שם משתמש או סיסמא שגויים");
    else setLoginErrorMessage("לא ניתן להתחבר, נסה שוב מאוחר יותר");
  };

  return (
    <>
      {/* Login Form on the Right */}
      <div className="flex flex-col justify-center items-center h-[100vh] md:w-1/2">
        <img className="w-[11em] mb-2" src={logoKisufim} alt="Your Company" />
        {/* Login Form */}
        <form
          className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="mb-3">ברוך שובך!</h1>
          <h2 className="text-xl font-bold mb-6">כניסה לחשבונך</h2>

          <InputCmp
            label="אימייל"
            name="email"
            value={userCredentials.email}
            onChange={handleChange}
            onBlur={validateForm}
            inputStyle="py-3"
            containerstyle="flex flex-col"
            labelStyle="relative w-fit bg-white top-[10px] right-[10px] px-2"
          />
          <ErrorMessage msg={error.email} style="h-[20px]  mr-3" />
          <InputCmp
            label="סיסמא"
            type="password"
            name="password"
            value={userCredentials.password}
            onChange={handleChange}
            onBlur={validateForm}
            inputStyle="py-3"
            containerstyle="flex flex-col"
            labelStyle="relative w-fit bg-white top-[10px] right-[10px] px-2"
          />
          <ErrorMessage msg={error.password} style="h-[20px] mb-6 mr-3" />
          <ErrorMessage
            msg={isLoading ? "" : loginErrorMessage}
            style="h-[25px] mr-3 text-center"
          />
          <ButtonCmp
            label={isLoading ? <Spinner style="w-6 h-6" /> : "כניסה לחשבון"}
            isDisabled={isButtonDisabled}
            onClick={handleSubmit}
            style="w-full py-3 h-[52px]"
          />
        </form>
      </div>
    </>
  );
};

export default LoginForm;
