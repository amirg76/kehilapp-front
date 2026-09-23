import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

import logoKisufim from "../img/logo-kibbuttz-transpert.png";

import InputCmp from "@components/form/InputCmp/InputCmp";
import ButtonCmp from "@components/form/ButtonCmp/ButtonCmp";
import ErrorMessage from "@components/ui/ErrorMessage";
import Spinner from "@components/ui/Spinner/Spinner";

import { REGISTER_URL } from "@api/apiConstants";
import { httpService } from "@/services/httpService";
import { validatePassword } from "@/utils/passwordPolicy";
import { validateEmail } from "@/utils/emailPolicy";

// routeConstants
import { LOGIN, VERIFY_EMAIL } from "@routes/routeConstants";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    email: null,
    password: null,
    confirmPassword: null,
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  // On success we keep the dev-only verification token so the whole flow is
  // demoable without a real inbox. The server returns it only when it is running
  // in development AND has been told to by name, so on a real deployment this
  // stays the empty string and the demo shortcut below never renders.
  const [verificationToken, setVerificationToken] = useState(null);
  // Whether a verification email actually left the server. Previously this was
  // inferred from the presence of the token — which, with no mail provider
  // configured, was always present, so "check your inbox" was shown for an inbox
  // nothing had been sent to. The server now answers it outright.
  const [emailDelivered, setEmailDelivered] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(
      Object.values(error).some((value) => value?.length > 0 || value === null)
    );
  }, [error]);

  const validateField = (name, value, all) => {
    switch (name) {
      case "email":
        // Same shared policy the login form uses — see src/utils/emailPolicy.js.
        // The two forms held identical regexes here too, which is the same setup
        // that let the password rule drift away from the server.
        setError((p) => ({ ...p, email: validateEmail(value) }));
        break;
      case "password":
        // Same shared policy the login form uses — see src/utils/passwordPolicy.js.
        // The two forms used to hold identical regexes, which is how they drifted
        // away from the server's Joi.string().min(8).max(128) together.
        setError((p) => ({ ...p, password: validatePassword(value) }));
        // re-check confirm against the new password
        if (all?.confirmPassword?.length) {
          setError((p) => ({
            ...p,
            confirmPassword:
              all.confirmPassword === value ? "" : "הסיסמאות אינן תואמות",
          }));
        }
        break;
      case "confirmPassword":
        if (!value || !value.length)
          setError((p) => ({ ...p, confirmPassword: "שדה חובה" }));
        else if (value !== all.password)
          setError((p) => ({ ...p, confirmPassword: "הסיסמאות אינן תואמות" }));
        else setError((p) => ({ ...p, confirmPassword: "" }));
        break;
      default:
        break;
    }
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    const next = { ...credentials, [name]: value };
    setCredentials(next);
    validateField(name, value, next);
  };

  const handleBlur = (ev) => {
    const { name, value } = ev.target;
    validateField(name, value, credentials);
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: () =>
      httpService.post(REGISTER_URL, {
        name: credentials.name || undefined,
        email: credentials.email,
        password: credentials.password,
      }),
    onSuccess: (data) => {
      setServerErrorMessage("");
      // Prefer the explicit token; fall back to parsing it out of the link.
      const token =
        data?.verificationToken ||
        (data?.verificationLink
          ? new URL(data.verificationLink).searchParams.get("token")
          : null);
      setVerificationToken(token || "");
      // Treat a missing field as "delivered" so an older server — or any response
      // shape we did not anticipate — does not tell the user their email failed
      // when it may well have arrived. Only an explicit `false` is a failure.
      setEmailDelivered(data?.emailDelivered !== false);
    },
    onError: (err) => {
      const status = err?.response?.status;
      if (status === 409)
        setServerErrorMessage("כתובת המייל כבר רשומה במערכת");
      else if (status === 400)
        setServerErrorMessage("פרטי ההרשמה אינם תקינים");
      else if (status === 429)
        // Rate limited. Say so plainly — the old generic message made a temporary
        // throttle look like a broken form.
        setServerErrorMessage(
          "יותר מדי ניסיונות הרשמה. המתן כמה דקות ונסה שוב.",
        );
      else if (!status)
        // No status at all means the request never reached the server.
        setServerErrorMessage(
          "לא ניתן להתחבר לשרת. בדוק את החיבור ונסה שוב.",
        );
      else setServerErrorMessage("ההרשמה נכשלה, נסה שוב מאוחר יותר");
    },
  });

  const handleSubmit = (ev) => {
    ev.preventDefault();
    mutate();
  };

  const labelStyle =
    "relative w-fit bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 top-[10px] right-[10px] px-2";

  // --- Success state: "check your email" + demo verify link ------------------
  if (verificationToken !== null) {
    const demoVerifyLink = verificationToken
      ? `${VERIFY_EMAIL}?token=${verificationToken}`
      : null;
    // Three outcomes, and they must not be told apart by guesswork:
    //   delivered            → check your inbox
    //   not delivered + link → the local demo, which has no inbox at all
    //   not delivered, no link → a real send failure. Saying "check your inbox"
    //                            here sends the user to wait for nothing.
    const sendFailed = !emailDelivered && !demoVerifyLink;
    return (
      <div className="flex flex-col justify-center items-center min-h-[100vh] py-10 px-4 md:w-1/2">
        <img className="w-[11em] mb-2" src={logoKisufim} alt="כיסופים" />
        <div className="w-full max-w-md px-8 py-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg text-center">
          <div className="text-5xl mb-4">{sendFailed ? "⚠️" : "📧"}</div>
          <h1 className="mb-3 dark:text-slate-100">
            {sendFailed ? "החשבון נוצר" : "כמעט שם!"}
          </h1>
          <h2 className="text-xl font-bold mb-4 dark:text-slate-100">
            {sendFailed
              ? "לא הצלחנו לשלוח את מייל האימות"
              : "בדוק את תיבת המייל שלך"}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">
            {sendFailed ? (
              <>
                החשבון של{" "}
                <span className="font-semibold">{credentials.email}</span> נוצר,
                אבל שליחת מייל האימות נכשלה. אפשר לבקש מייל חדש ממסך ההתחברות —
                החשבון ממתין שם.
              </>
            ) : (
              <>
                שלחנו קישור אימות לכתובת{" "}
                <span className="font-semibold">{credentials.email}</span>. לחץ
                עליו כדי לאמת את החשבון. לאחר האימות מנהל הקהילה יצטרך לאשר את
                החשבון — כך שאם לא תראו מיד את כל התוכן, זה צפוי.
              </>
            )}
          </p>

          {demoVerifyLink && (
            <div className="mb-6 rounded-xl border border-dashed border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-slate-700/40 p-4">
              <p className="text-sm text-slate-500 dark:text-slate-300 mb-3">
                אין תיבת מייל אמיתית בהדגמה — לכן הנה הקישור ישירות:
              </p>
              <ButtonCmp
                label="אמת את המייל שלי (הדגמה)"
                style="w-full py-3"
                onClick={() => navigate(demoVerifyLink)}
              />
            </div>
          )}

          <Link
            to={LOGIN}
            className="text-primary-700 dark:text-primary-300 hover:underline"
          >
            חזרה להתחברות
          </Link>
        </div>
      </div>
    );
  }

  // --- Registration form -----------------------------------------------------
  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh] py-10 px-4 md:w-1/2">
      <img className="w-[11em] mb-2" src={logoKisufim} alt="כיסופים" />
      <form
        className="w-full max-w-md px-8 py-10 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-3 dark:text-slate-100">ברוכים הבאים!</h1>
        <h2 className="text-xl font-bold mb-6 dark:text-slate-100">
          הרשמה לקהילה
        </h2>

        {/* maxLength, not a validator. The server's rule is
            Joi.string().max(120).optional()
            (kehilapp-backend-hardened/src/apps/auth/entryPoints/authValidation.js:21),
            and this field had no rule at all — so a 121st character produced a
            generic 400 after submit with nothing pointing at the name. The
            deviation is in the safe direction (client looser than server), so
            the fix is to stop the 121st character from being typed rather than
            to add a third place that can disagree with the server. Same
            treatment the message form already gives its own caps
            (MessageFormSection.jsx: maxLength="25" on the title). The number is
            written here literally because this repo has no shared limits module
            to put it in — passwordPolicy.js and emailPolicy.js are per-field and
            this is the only place the name cap is needed. */}
        <InputCmp
          label="שם מלא"
          name="name"
          value={credentials.name}
          onChange={handleChange}
          maxLength={120}
          inputStyle="py-3 dark:bg-slate-700 dark:text-slate-100"
          containerStyle="flex flex-col"
          labelStyle={labelStyle}
          placeholder="איך לקרוא לך?"
        />

        <InputCmp
          label="אימייל"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          onBlur={handleBlur}
          inputStyle="py-3 dark:bg-slate-700 dark:text-slate-100"
          containerStyle="flex flex-col"
          labelStyle={labelStyle}
        />
        <ErrorMessage msg={error.email} style="h-[20px] mr-3" />

        <InputCmp
          label="סיסמא"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          onBlur={handleBlur}
          inputStyle="py-3 dark:bg-slate-700 dark:text-slate-100"
          containerStyle="flex flex-col"
          labelStyle={labelStyle}
        />
        <ErrorMessage msg={error.password} style="h-[20px] mr-3" />

        <InputCmp
          label="אימות סיסמא"
          type="password"
          name="confirmPassword"
          value={credentials.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          inputStyle="py-3 dark:bg-slate-700 dark:text-slate-100"
          containerStyle="flex flex-col"
          labelStyle={labelStyle}
        />
        <ErrorMessage msg={error.confirmPassword} style="h-[20px] mb-4 mr-3" />

        <ErrorMessage
          msg={isLoading ? "" : serverErrorMessage}
          style="h-[25px] mr-3 text-center"
        />

        <ButtonCmp
          label={isLoading ? <Spinner style="w-6 h-6" /> : "הרשמה"}
          isDisabled={isButtonDisabled}
          onClick={handleSubmit}
          style="w-full py-3 h-[52px]"
        />

        {/* Mirror of the login screen's cross-link — a real action, not body copy. */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-600">
          <p className="mb-3 text-center text-sm text-slate-600 dark:text-slate-300">
            כבר רשום?
          </p>
          <Link
            to={LOGIN}
            data-testid="link-to-login"
            className="flex w-full items-center justify-center rounded-md border-2 border-solid
                       border-primary-700 py-3 text-lg font-medium text-primary-700 transition-colors
                       hover:bg-primary-700 hover:text-white
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500
                       focus-visible:ring-offset-2 focus-visible:ring-offset-white
                       dark:border-primary-400 dark:text-primary-200 dark:hover:bg-primary-600
                       dark:hover:text-white dark:focus-visible:ring-offset-slate-800"
          >
            כניסה לחשבון קיים
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
