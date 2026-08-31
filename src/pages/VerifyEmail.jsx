import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import logoKisufim from "@features/authentication/components/img/logo-kibbuttz-transpert.png";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";
import Spinner from "@components/ui/Spinner/Spinner";

import { VERIFY_EMAIL_URL } from "@api/apiConstants";
import { httpService } from "@/services/httpService";
import { LOGIN } from "@routes/routeConstants";

// A verification token is single-use — a second POST returns 400. React 18
// StrictMode mounts, unmounts, then remounts this page in dev, which would fire
// the request twice (the second failing) and also discards the first instance's
// state. We dedupe by caching ONE promise per token at module scope: every mount
// awaits the same in-flight request, so the surviving instance still gets the
// real result and the token is only ever spent once.
const verifyRequests = new Map();
function verifyToken(token) {
  if (!verifyRequests.has(token)) {
    verifyRequests.set(token, httpService.post(VERIFY_EMAIL_URL, { token }));
  }
  return verifyRequests.get(token);
}

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  // "missing" | "loading" | "success" | "error"
  const [status, setStatus] = useState(token ? "loading" : "missing");

  useEffect(() => {
    if (!token) return;
    let active = true;
    verifyToken(token)
      .then(() => active && setStatus("success"))
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#EFEFEF] to-white dark:from-slate-900 dark:to-slate-800 px-4">
      <img className="w-[11em] mb-4" src={logoKisufim} alt="כיסופים" />
      <div className="w-full max-w-md px-8 py-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center">
        {status === "missing" && (
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

        {status === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <Spinner style="w-10 h-10 text-primary-700" />
            </div>
            <h2 className="text-xl font-bold dark:text-slate-100">
              מאמת את המייל שלך...
            </h2>
          </>
        )}

        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-3 dark:text-slate-100">
              המייל אומת בהצלחה!
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              החשבון שלך הופעל. אפשר להתחבר עכשיו.
            </p>
          </>
        )}

        {status === "error" && (
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

        <ButtonCmp
          label="מעבר להתחברות"
          style="w-full py-3"
          onClick={() => navigate(LOGIN)}
        />
      </div>
    </div>
  );
};

export default VerifyEmail;
