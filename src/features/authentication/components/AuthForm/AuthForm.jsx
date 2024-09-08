import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authActions } from "@store/slices/authSlice";
import { useDispatch } from "react-redux";
import logoKisufim from "../img/logo-kibbuttz-transpert.png";
import InputCmp from "@components/form/InputCmp/InputCmp";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";
import ErrorMessage from "@components/ui/ErrorMessage";
import { LOGIN_URL, REGISTER_URL } from "@api/apiConstants";
import { httpService, queryClient } from "@services/httpService";
import { useMutation } from "react-query";
import Spinner from "@ui/Spinner/Spinner";
import { MESSAGES } from "@routes/routeConstants";
import validateEmail from "@hooks/validateEmail";
import validatePassword from "@hooks/validatePassword";
import useButtonDisabled from "@hooks/useButtonDisabled";
import { useOnUserAuth } from "../../hooks/useOnUserAuth";

const AuthForm = ({ type }) => {
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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    useButtonDisabled(setIsButtonDisabled, error);
  }, [error]);

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setUserCredentials({ ...userCredentials, [name]: value });
    validateForm(ev);
  };

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

  const handleSuccess = useCallback(
    (data) => {
      if (data?.error?.status === 404 || data?.error?.status === 401) {
        updateErrorMessage(data?.error?.status);
      } else {
        sessionStorage.setItem("loggedInUser", JSON.stringify(data));
        dispatch(authActions[type](data));

        navigate(MESSAGES);
      }
    },
    [dispatch, navigate, type]
  );

  const updateErrorMessage = (errStatus) => {
    if (errStatus) {
      if (errStatus === 404) setErrorMessage("משתמש לא קיים במערכת");
      // setErrorMessage("משתמש זה כבר קיים במערכת");
      else if (errStatus === 401) setErrorMessage("סיסמא לא נכונה, נסה שוב");
    } else setErrorMessage("לא ניתן להתחבר, נסה שוב מאוחר יותר");
  };

  const {
    mutate,
    isLoading,
    isError,
    error: authError,
  } = useMutation({
    mutationFn: () =>
      httpService.post(
        type === "register" ? REGISTER_URL : LOGIN_URL,
        userCredentials
      ),
    onSuccess: (data) => handleSuccess(data),
    onError: (err) => updateErrorMessage(err),
  });

  const formTitle = type === "register" ? "הרשמה לאתר" : "כניסה לאתר";
  const formSubtitle =
    type === "register" ? "פתיחת חשבון חדש" : "התחבר לחשבון שלך";
  const buttonLabel = type === "register" ? "תרשמו אותי" : "כניסה";

  return (
    <>
      <div className="flex flex-col justify-center items-center h-[100vh] md:w-1/2">
        <img className="w-[11em] mb-2" src={logoKisufim} alt="Your Company" />
        <form
          className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="mb-3">{formTitle}</h1>
          <h2 className="text-xl font-bold mb-6">{formSubtitle}</h2>

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
            msg={isLoading ? "" : errorMessage}
            style="h-[25px] mr-3 text-center"
          />
          <ButtonCmp
            label={isLoading ? <Spinner style="w-6 h-6" /> : buttonLabel}
            isDisabled={isButtonDisabled}
            onClick={handleSubmit}
            style="w-full py-3 h-[52px]"
          />
        </form>
      </div>
    </>
  );
};

export default AuthForm;
