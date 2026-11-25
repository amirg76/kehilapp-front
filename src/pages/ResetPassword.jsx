import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "react-query";

import AuthLogoHeader from "@features/authentication/components/AuthLogoHeader/AuthLogoHeader";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";
import InputCmp from "@components/form/InputCmp/InputCmp";
import ErrorMessage from "@components/ui/ErrorMessage";
import Spinner from "@components/ui/Spinner/Spinner";
import { validatePassword } from "@/utils/passwordPolicy";

import { RESET_PASSWORD_URL } from "@api/apiConstants";
import { httpService } from "@/services/httpService";
import { FORGOT_PASSWORD, LOGIN } from "@routes/routeConstants";

// A new password from the emailed link (25.11.2026). The link works once and
// for an hour; the server also logs out every session signed before the reset.
// Nothing is sent on load: the request goes out on submit, with the token.

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [submitError, setSubmitError] = useState("");
  // "form" | "success" | "error" (the link itself is invalid, used or expired)
  const [status, setStatus] = useState("form");

  const { mutate, isLoading } = useMutation({
    mutationFn: () => httpService.post(RESET_PASSWORD_URL, { token, password }),
    onSuccess: () => setStatus("success"),
    onError: (err) => {
      // Mapped by status, never by the server's (English) text. The password
      // rule is checked here first, so a 400 means the link.
      const code = err?.response?.status;
      if (code === 400) {
        setStatus("error");
      } else if (code === 429) {
        setSubmitError("יותר מדי ניסיונות. זו הגבלה זמנית: נסה שוב בעוד שעה.");
      } else {
        setSubmitError("לא ניתן לשמור כרגע, נסה שוב מאוחר יותר.");
      }
    },
  });

  const mismatch = confirm.length > 0 && confirm !== password;

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (isLoading || validatePassword(password) || password !== confirm) return;
    setSubmitError("");
    mutate();
  };

  const view = token ? status : "missing";
  const isButtonDisabled =
    isLoading || passwordError !== "" || !password || password !== confirm;

  const inputProps = {
    type: "password",
    autoComplete: "new-password",
    inputStyle: "py-3 dark:!bg-slate-800 dark:text-slate-100",
    containerStyle: "flex flex-col",
    labelStyle:
      "relative w-fit bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 top-[10px] right-[10px] px-2",
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#EFEFEF] to-white dark:from-slate-900 dark:to-slate-800 px-4">
      <AuthLogoHeader className="mb-4" />
      <div className="w-full max-w-md px-8 py-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center">
        {view === "missing" && (
          <>
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-3 dark:text-slate-100">
              קישור איפוס חסר
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              לא נמצא אסימון איפוס בכתובת. ודא שהשתמשת בקישור המלא מהמייל.
            </p>
          </>
        )}

        {view === "form" && (
          <form onSubmit={handleSubmit} className="text-right">
            <h2 className="text-xl font-bold mb-3 text-center dark:text-slate-100">
              בחירת סיסמה חדשה
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4 text-center">
              אחרי השמירה, כל מי שמחובר לחשבון ינותק.
            </p>
            <InputCmp
              {...inputProps}
              label="סיסמה חדשה"
              name="password"
              value={password}
              onChange={(ev) => {
                setPassword(ev.target.value);
                setPasswordError(validatePassword(ev.target.value));
                setSubmitError("");
              }}
            />
            <ErrorMessage msg={passwordError} style="h-[20px] mr-3" />
            <InputCmp
              {...inputProps}
              label="הסיסמה שוב"
              name="confirm"
              value={confirm}
              onChange={(ev) => {
                setConfirm(ev.target.value);
                setSubmitError("");
              }}
            />
            <ErrorMessage
              msg={mismatch ? "הסיסמאות אינן זהות" : ""}
              style="h-[20px] mr-3"
            />
            <ErrorMessage
              msg={isLoading ? "" : submitError}
              style="min-h-[25px] mr-3 mb-2 text-center"
            />
            <ButtonCmp
              label={isLoading ? <Spinner style="w-6 h-6" /> : "שמירת הסיסמה"}
              isDisabled={isButtonDisabled}
              onClick={handleSubmit}
              style="w-full py-3 h-[52px]"
            />
          </form>
        )}

        {view === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-3 dark:text-slate-100">
              הסיסמה הוחלפה
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              אפשר להתחבר עם הסיסמה החדשה. מי שהיה מחובר לחשבון לפני כן נותק.
            </p>
          </>
        )}

        {view === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold mb-3 dark:text-slate-100">
              הקישור לא עובד
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              הקישור אינו תקין, פג תוקפו, או שכבר השתמשו בו.{" "}
              <button
                type="button"
                onClick={() => navigate(FORGOT_PASSWORD)}
                className="text-primary-700 dark:text-primary-300 font-semibold hover:underline"
              >
                לבקש קישור חדש
              </button>
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

export default ResetPassword;
