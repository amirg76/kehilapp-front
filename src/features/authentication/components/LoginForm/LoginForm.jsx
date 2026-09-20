import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// redux
import { authActions } from "@store/slices/authSlice";
import { useDispatch } from "react-redux";

import logoKisufim from "../img/logo-kibbuttz-transpert.png";

import InputCmp from "@components/form/InputCmp/InputCmp";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";
import ErrorMessage from "@components/ui/ErrorMessage";
import { validatePassword } from "@/utils/passwordPolicy";

import { LOGIN_URL, RESEND_VERIFICATION_URL } from "../../../../api/apiConstants";
import { httpService, queryClient } from "../../../../services/httpService";
import { useMutation } from "react-query";
import LoadingPage from "../../../../components/ui/LoadingPage/LoadingPage";
import Spinner from "../../../../components/ui/Spinner/Spinner";

// routeConstants
import { MESSAGES, REGISTER } from "@routes/routeConstants";

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
  // A 403 means the account exists but the email isn't verified — surface a
  // dedicated "resend verification" action instead of the generic error.
  const [isUnverified, setIsUnverified] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    setIsButtonDisabled(
      Object.values(error).some((value) => value?.length > 0 || value === null)
    );
  }, [error]);

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setUserCredentials({ ...userCredentials, [name]: value });
    validateForm(ev);
  };

  const validateForm = (ev) => {
    const { name, value } = ev.target;
    // console.log('validate', name, value);
    switch (name) {
      case "email":
        if (!value || !value.length) {
          setError((prevErrors) => ({ ...prevErrors, email: "שדה חובה" }));
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          setError((prevErrors) => ({
            ...prevErrors,
            email: "כתובת המייל אינה תקינה",
          }));
        } else {
          setError((prevErrors) => ({ ...prevErrors, email: "" }));
        }
        break;
      case "password":
        // Length policy lives in one place and mirrors the server's
        // Joi.string().min(8).max(128). A local copy here is what let the client
        // drift to an 8-20 window and lock every 24-character demo password out.
        setError((prevErrors) => ({
          ...prevErrors,
          password: validatePassword(value),
        }));
        break; // was fall-through — default is a no-op, so behavior is unchanged
      default:
        break;
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setResendMessage("");
    setIsUnverified(false);
    mutate();
  };

  const { mutate: resendVerification, isLoading: isResending } = useMutation({
    mutationFn: () =>
      httpService.post(RESEND_VERIFICATION_URL, {
        email: userCredentials.email,
      }),
    onSuccess: () =>
      setResendMessage("שלחנו מייל אימות חדש. בדוק את תיבת הדואר שלך."),
    onError: () =>
      setResendMessage("שליחת מייל האימות נכשלה, נסה שוב מאוחר יותר."),
  });

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
    // Set user information in session storage
    sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    // Dispatch the login action with user information
    dispatch(authActions.login(user));
    // Refetch content now that a session cookie exists: messages must reload so
    // members-only posts appear, and the (auth-only) user directory can load.
    // Without this, react-query keeps the anonymous (public-only) cache and the
    // content tier is invisible until a manual refresh.
    queryClient.invalidateQueries({ queryKey: ["messages"] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
    // Navigate to main page
    navigate(MESSAGES);
  };

  const updateErrorMessage = (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      setIsUnverified(false);
      setLoginErrorMessage("שם משתמש או סיסמא שגויים");
    } else if (status === 403) {
      // Account exists but email is unverified.
      setIsUnverified(true);
      setLoginErrorMessage(
        "המייל שלך עדיין לא אומת. בדוק את תיבת הדואר או שלח מייל אימות מחדש."
      );
    } else {
      setIsUnverified(false);
      setLoginErrorMessage("לא ניתן להתחבר, נסה שוב מאוחר יותר");
    }
  };

  return (
    <>
      {/* Login Form on the Right */}
      <div className="flex flex-col justify-center items-center min-h-[100vh] py-10 px-4 md:w-1/2">
        <img className="w-[11em] mb-2" src={logoKisufim} alt="כיסופים" />
        {/* Login Form */}
        <form
          className="w-full max-w-md px-8 py-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="mb-3 dark:text-slate-100">ברוך שובך!</h1>
          <h2 className="text-xl font-bold mb-6 dark:text-slate-100">
            כניסה לחשבונך
          </h2>

          <InputCmp
            label="אימייל"
            name="email"
            value={userCredentials.email}
            onChange={handleChange}
            onBlur={validateForm}
            inputStyle="py-3 dark:bg-slate-700 dark:text-slate-100"
            containerStyle="flex flex-col"
            labelStyle="relative w-fit bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 top-[10px] right-[10px] px-2"
          />
          <ErrorMessage msg={error.email} style="h-[20px]  mr-3" />
          <InputCmp
            label="סיסמא"
            type="password"
            name="password"
            value={userCredentials.password}
            onChange={handleChange}
            onBlur={validateForm}
            inputStyle="py-3 dark:bg-slate-700 dark:text-slate-100"
            containerStyle="flex flex-col"
            labelStyle="relative w-fit bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 top-[10px] right-[10px] px-2"
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

          {isUnverified && (
            <div className="mt-4 rounded-xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-900/20 p-4 text-center">
              <button
                type="button"
                onClick={() => resendVerification()}
                disabled={isResending}
                className="text-primary-700 dark:text-primary-300 font-semibold hover:underline disabled:opacity-50"
              >
                {isResending ? "שולח..." : "שלח מייל אימות שוב"}
              </button>
              {resendMessage && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {resendMessage}
                </p>
              )}
            </div>
          )}

          {/* Cross-link to signup. Rendered as a real (outlined) action rather
              than an inline text link — as plain text it read as body copy and
              was easy to miss. */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
            <p className="mb-3 text-center text-sm text-slate-600 dark:text-slate-300">
              אין לך חשבון?
            </p>
            <Link
              to={REGISTER}
              data-testid="link-to-register"
              className="flex w-full items-center justify-center rounded-md border-2 border-solid
                         border-primary-700 py-3 text-lg font-medium text-primary-700 transition-colors
                         hover:bg-primary-700 hover:text-white
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                         focus-visible:ring-offset-2 focus-visible:ring-offset-white
                         dark:border-primary-400 dark:text-primary-200 dark:hover:bg-primary-600
                         dark:hover:text-white dark:focus-visible:ring-offset-slate-800"
            >
              יצירת חשבון חדש
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
