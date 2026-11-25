import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

import AuthLogoHeader from "@features/authentication/components/AuthLogoHeader/AuthLogoHeader";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";
import InputCmp from "@components/form/InputCmp/InputCmp";
import ErrorMessage from "@components/ui/ErrorMessage";
import Spinner from "@components/ui/Spinner/Spinner";
import { validateEmail } from "@/utils/emailPolicy";

import { FORGOT_PASSWORD_URL } from "@api/apiConstants";
import { httpService } from "@/services/httpService";
import { LOGIN, REGISTER } from "@routes/routeConstants";

// "Forgot password" (25.11.2026). The server answers every address the same,
// and only a verified account's inbox gets a link, so this page never says
// whether the address is registered: after a send it always shows the same
// conditional message.

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [sent, setSent] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: () => httpService.post(FORGOT_PASSWORD_URL, { email }),
    onSuccess: () => setSent(true),
    onError: (err) => {
      // Mapped by status, never by the server's (English) text.
      const code = err?.response?.status;
      if (code === 429) {
        setSubmitError("יותר מדי בקשות. זו הגבלה זמנית: נסה שוב בעוד שעה.");
      } else if (code === 400) {
        setSubmitError("כתובת המייל אינה בפורמט תקין.");
      } else {
        setSubmitError("לא ניתן לשלוח כרגע, נסה שוב מאוחר יותר.");
      }
    },
  });

  const handleChange = (ev) => {
    setEmail(ev.target.value);
    setEmailError(validateEmail(ev.target.value));
    setSubmitError("");
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (isLoading || validateEmail(email)) return;
    setSubmitError("");
    mutate();
  };

  const isButtonDisabled = isLoading || emailError !== "" || !email;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#EFEFEF] to-white dark:from-slate-900 dark:to-slate-800 px-4">
      <AuthLogoHeader className="mb-4" />
      <div className="w-full max-w-md px-8 py-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center">
        {!sent && (
          <form onSubmit={handleSubmit} className="text-right">
            <h2 className="text-xl font-bold mb-3 text-center dark:text-slate-100">
              שכחת את הסיסמה?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4 text-center">
              הקלד את כתובת המייל שאיתה נרשמת, ונשלח אליה קישור לבחירת סיסמה
              חדשה.
            </p>
            <InputCmp
              label="אימייל"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={handleChange}
              inputStyle="py-3 dark:!bg-slate-800 dark:text-slate-100"
              containerStyle="flex flex-col"
              labelStyle="relative w-fit bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 top-[10px] right-[10px] px-2"
            />
            <ErrorMessage msg={emailError} style="h-[20px] mr-3" />
            <ErrorMessage
              msg={isLoading ? "" : submitError}
              style="min-h-[25px] mr-3 mb-2 text-center"
            />
            <ButtonCmp
              label={isLoading ? <Spinner style="w-6 h-6" /> : "שליחת קישור"}
              isDisabled={isButtonDisabled}
              onClick={handleSubmit}
              style="w-full py-3 h-[52px]"
            />
          </form>
        )}

        {sent && (
          <>
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-xl font-bold mb-3 dark:text-slate-100">
              בדוק את תיבת המייל
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-3">
              אם הכתובת רשומה באתר ואומתה, שלחנו אליה קישור לבחירת סיסמה חדשה.
              הקישור תקף לשעה אחת.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              נרשמת ועוד לא אימתת את המייל? אפשר{" "}
              <button
                type="button"
                onClick={() => navigate(REGISTER)}
                className="text-primary-700 dark:text-primary-300 font-semibold hover:underline"
              >
                להירשם שוב עם אותה כתובת
              </button>
              .
            </p>
          </>
        )}

        <button
          type="button"
          onClick={() => navigate(LOGIN)}
          className="mt-6 text-primary-700 dark:text-primary-300 font-semibold hover:underline"
        >
          חזרה לכניסה
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
