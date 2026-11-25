import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// redux
import { authActions } from "@store/slices/authSlice";
import { useDispatch } from "react-redux";

import AuthLogoHeader from "../AuthLogoHeader/AuthLogoHeader";

import InputCmp from "@components/form/InputCmp/InputCmp";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";
import ErrorMessage from "@components/ui/ErrorMessage";
import { validatePassword } from "@/utils/passwordPolicy";
import { validateEmail } from "@/utils/emailPolicy";

import { LOGIN_URL, RESEND_VERIFICATION_URL } from "../../../../api/apiConstants";
import { httpService, queryClient } from "../../../../services/httpService";
import { useMutation } from "react-query";
import LoadingPage from "../../../../components/ui/LoadingPage/LoadingPage";
import Spinner from "../../../../components/ui/Spinner/Spinner";

// routeConstants
import { FORGOT_PASSWORD, MESSAGES, REGISTER } from "@routes/routeConstants";

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
  // Offered after EVERY refused login (25.11.2026). The server used to answer
  // an unverified account 403, and that told a stranger who is a verified
  // member (register with the address and your own password, then log in with
  // it). Now an unverified account gets the same 401 as a wrong password, so
  // the page cannot tell them apart either; the resend answer is the same for
  // every address, so offering it always reveals nothing.
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
    switch (name) {
      case "email":
        // Structural check only, shared with the register form — see
        // src/utils/emailPolicy.js. The rule that used to live here allowed only
        // ._%+- in the local part, so o'brien@example.com (and four other
        // measured shapes) left its owner in front of a permanently disabled
        // "כניסה לחשבון" button for an account that exists and a password that
        // is correct. The server decides what an address is; this only catches
        // the obvious typo.
        setError((prevErrors) => ({
          ...prevErrors,
          email: validateEmail(value),
        }));
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
    // Conditional on purpose: the server says the same for every address.
    onSuccess: () =>
      setResendMessage(
        "אם הכתובת רשומה ועוד לא אומתה, שלחנו אליה מייל אימות חדש. בדוק את תיבת הדואר."
      ),
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
      // Wrong email, wrong password, or an address not yet verified: the
      // server answers all three alike, so the page offers the resend too.
      // Login is by email, so the message names the field the form actually
      // has — there is no "username" anywhere in this app.
      setIsUnverified(true);
      setLoginErrorMessage("האימייל או הסיסמה שגויים");
    } else if (status === 400) {
      // Now reachable, and it was not before. The field rule above deliberately
      // stops mirroring the server's Joi.string().email(), so an address the
      // server refuses (an unknown TLD, a local part over its length cap) now
      // gets as far as a request instead of being stopped by a dead button.
      // That trade is only honest if the answer says which field to fix — the
      // generic branch below would have told them the server was unreachable,
      // which is a different problem and sends them looking in the wrong place.
      setIsUnverified(false);
      setLoginErrorMessage("כתובת המייל או הסיסמה אינן בפורמט תקין");
    } else if (status === 429) {
      // Rate limited, and the server really does answer this: app.js mounts
      // loginLimiter on /api/auth/login ahead of the auth router — 10 requests
      // per 15-minute window, with skipSuccessfulRequests, so only FAILED
      // attempts spend the budget (middlewares/rateLimit.js). Without this
      // branch the generic message below said "לא ניתן להתחבר" — which reads as
      // a network or server fault and sends someone who is simply throttled off
      // to check their connection, restart the browser, or conclude the account
      // is locked. Nothing is locked and nothing is broken; the only fix is
      // waiting, so the message has to say that. RegisterForm.jsx already
      // carries the same branch for registerLimiter.
      //
      // Mapped by status, never by printing the server's text: the body is the
      // API's English AppError message, and matching or echoing prose breaks
      // the day someone rewords it.
      setIsUnverified(false);
      setLoginErrorMessage(
        "יותר מדי ניסיונות כניסה שנכשלו. החשבון לא ננעל — זו הגבלה זמנית, והיא מתאפסת מעצמה. המתן כרבע שעה ונסה שוב."
      );
    } else {
      setIsUnverified(false);
      setLoginErrorMessage("לא ניתן להתחבר, נסה שוב מאוחר יותר");
    }
  };

  return (
    <>
      {/* Login Form on the Right */}
      {/* pt-4: the back link at the top is itself spaced (py-2); with py-10 the
          phone page scrolled a few pixels once the link was added. */}
      <div className="flex flex-col justify-center items-center min-h-[100vh] pt-4 pb-10 px-4 md:w-1/2">
        <AuthLogoHeader />
        {/* Login Form */}
        <form
          className="w-full max-w-md px-8 py-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
          onSubmit={handleSubmit}
        >
          <h1 className="mb-3 dark:text-slate-100">ברוך שובך!</h1>
          <h2 className="text-xl font-bold mb-6 dark:text-slate-100">
            כניסה לחשבונך
          </h2>

          {/* dark:!bg-slate-800 on the inputs: the floating label sits half on
              the card and half on the input, so the input takes the card's
              colour and the label's backing no longer shows as a dark box. */}
          <InputCmp
            label="אימייל"
            name="email"
            value={userCredentials.email}
            onChange={handleChange}
            onBlur={validateForm}
            inputStyle="py-3 dark:!bg-slate-800 dark:text-slate-100"
            containerStyle="flex flex-col"
            labelStyle="relative w-fit bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 top-[10px] right-[10px] px-2"
          />
          <ErrorMessage msg={error.email} style="h-[20px]  mr-3" />
          <InputCmp
            label="סיסמה"
            type="password"
            name="password"
            value={userCredentials.password}
            onChange={handleChange}
            onBlur={validateForm}
            inputStyle="py-3 dark:!bg-slate-800 dark:text-slate-100"
            containerStyle="flex flex-col"
            labelStyle="relative w-fit bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 top-[10px] right-[10px] px-2"
          />
          <ErrorMessage msg={error.password} style="h-[20px] mr-3" />
          {/* mb-2 on the link + the old mb-6 gap shrunk: the phone page was
              tuned not to scroll (see the pt-4 note above). */}
          {/* Right-aligned: the form is Hebrew (RTL), so the link sits under the
              start of the password field, where the eye already is. */}
          <div className="mb-2 mr-3 text-right">
            <Link
              to={FORGOT_PASSWORD}
              className="text-sm text-primary-700 dark:text-primary-300 hover:underline"
            >
              שכחת את הסיסמה?
            </Link>
          </div>
          <ErrorMessage
            msg={isLoading ? "" : loginErrorMessage}
            style="h-[25px] mr-3 text-center"
          />
          <ButtonCmp
            label={isLoading ? <Spinner style="w-6 h-6" /> : "כניסה לחשבון"}
            isDisabled={isButtonDisabled}
            onClick={handleSubmit}
            style="w-full py-3 h-[52px]"
            aria-describedby={isButtonDisabled && !isLoading ? "login-submit-hint" : undefined}
          />
          {/* A disabled button says nothing about why. */}
          {isButtonDisabled && !isLoading && (
            <p id="login-submit-hint" className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
              הכפתור יופעל אחרי שימולאו אימייל וסיסמה תקינים.
            </p>
          )}

          {isUnverified && (
            <div className="mt-4 rounded-xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-900/20 p-4 text-center">
              <p className="mb-2 text-sm text-slate-700 dark:text-slate-200">
                נרשמת ועוד לא אימתת את המייל?
              </p>
              <button
                type="button"
                onClick={() => resendVerification()}
                disabled={isResending}
                className="text-primary-700 dark:text-primary-300 font-semibold hover:underline disabled:opacity-50"
              >
                {isResending ? "שולח…" : "שלח מייל אימות שוב"}
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
