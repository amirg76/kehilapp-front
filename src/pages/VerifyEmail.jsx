import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";

import AuthLogoHeader from "@features/authentication/components/AuthLogoHeader/AuthLogoHeader";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";
import InputCmp from "@components/form/InputCmp/InputCmp";
import ErrorMessage from "@components/ui/ErrorMessage";
import Spinner from "@components/ui/Spinner/Spinner";
import { validatePassword } from "@/utils/passwordPolicy";

import { VERIFY_EMAIL_URL } from "@api/apiConstants";
import { httpService } from "@/services/httpService";
import { LOGIN, REGISTER } from "@routes/routeConstants";

// The page asks for the password chosen at registration before it verifies
// (24.11.2026). It used to verify the moment it opened, from the link alone.
// The link proves only that someone reads the inbox: a stranger could register
// first with a resident's address and the stranger's own password, and the
// resident, clicking "verify" in a genuine email, activated an account the
// stranger then logged in to. The server now refuses a verify without the
// matching password (403), and a new registration for the same address
// replaces a pending one, which is the way out for a forgotten password.
//
// Nothing is sent on load any more, so the StrictMode double-mount dedupe
// that used to live here is gone with it: the request goes out on submit.

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [submitError, setSubmitError] = useState("");
  // "form" | "success" | "error" (the link itself is invalid or expired)
  const [status, setStatus] = useState("form");

  const { mutate, isLoading } = useMutation({
    mutationFn: () => httpService.post(VERIFY_EMAIL_URL, { token, password }),
    onSuccess: () => setStatus("success"),
    onError: (err) => {
      // Mapped by status, never by the server's (English) text.
      const code = err?.response?.status;
      if (code === 403) {
        setSubmitError(
          "הסיסמה לא תואמת לסיסמה שנבחרה בהרשמה. אפשר לנסות שוב."
        );
      } else if (code === 400) {
        setStatus("error");
      } else if (code === 429) {
        setSubmitError(
          "יותר מדי ניסיונות. זו הגבלה זמנית: נסה שוב בעוד שעה."
        );
      } else {
        setSubmitError("לא ניתן לאמת כרגע, נסה שוב מאוחר יותר.");
      }
    },
  });

  const handleChange = (ev) => {
    setPassword(ev.target.value);
    setPasswordError(validatePassword(ev.target.value));
    setSubmitError("");
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (isLoading || validatePassword(password)) return;
    setSubmitError("");
    mutate();
  };

  const view = token ? status : "missing";
  const isButtonDisabled = isLoading || passwordError !== "" || !password;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#EFEFEF] to-white dark:from-slate-900 dark:to-slate-800 px-4">
      <AuthLogoHeader className="mb-4" />
      <div className="w-full max-w-md px-8 py-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center">
        {view === "missing" && (
          <>
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-3 dark:text-slate-100">
              קישור אימות חסר
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              לא נמצא אסימון אימות בכתובת. ודא שהשתמשת בקישור המלא מהמייל.
            </p>
          </>
        )}

        {view === "form" && (
          <form onSubmit={handleSubmit} className="text-right">
            <h2 className="text-xl font-bold mb-3 text-center dark:text-slate-100">
              אימות כתובת המייל
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4 text-center">
              כדי להשלים את ההרשמה, הקלד את הסיסמה שבחרת בהרשמה.
            </p>
            <InputCmp
              label="סיסמה"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={handleChange}
              inputStyle="py-3 dark:!bg-slate-800 dark:text-slate-100"
              containerStyle="flex flex-col"
              labelStyle="relative w-fit bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 top-[10px] right-[10px] px-2"
            />
            <ErrorMessage msg={passwordError} style="h-[20px] mr-3" />
            <ErrorMessage
              msg={isLoading ? "" : submitError}
              style="min-h-[25px] mr-3 mb-2 text-center"
            />
            <ButtonCmp
              label={isLoading ? <Spinner style="w-6 h-6" /> : "אימות החשבון"}
              isDisabled={isButtonDisabled}
              onClick={handleSubmit}
              style="w-full py-3 h-[52px]"
            />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 text-center">
              שכחת את הסיסמה? אפשר{" "}
              <button
                type="button"
                onClick={() => navigate(REGISTER)}
                className="text-primary-700 dark:text-primary-300 font-semibold hover:underline"
              >
                להירשם שוב עם אותה כתובת
              </button>
              , וישלח אליך קישור חדש.
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 text-center">
              לא נרשמת לקהילאפ? אפשר לסגור את הדף.
            </p>
          </form>
        )}

        {view === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-3 dark:text-slate-100">
              המייל אומת בהצלחה!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              המייל שלך אומת. החשבון ממתין עכשיו לאישור של מנהל הקהילה — אפשר
              כבר להתחבר ולראות את התוכן הציבורי, והגישה המלאה תיפתח לאחר
              האישור.
            </p>
          </>
        )}

        {view === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold mb-3 dark:text-slate-100">
              האימות נכשל
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              הקישור אינו תקין או שפג תוקפו. נסה להירשם מחדש או לבקש מייל אימות
              חדש.
            </p>
          </>
        )}

        {view !== "form" && (
          <ButtonCmp
            label="מעבר להתחברות"
            style="w-full py-3"
            onClick={() => navigate(LOGIN)}
          />
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
