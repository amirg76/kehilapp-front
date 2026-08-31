import React from "react";
import LoginImage from "@features/authentication/components/LoginImage/LoginImage";
import RegisterForm from "@features/authentication/components/RegisterForm/RegisterForm";

const Register = () => {
  return (
    // min-h-screen (not h-screen): the four-field card is taller than a phone
    // viewport, and a fixed height clipped the submit button.
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-[#EFEFEF] to-white dark:from-slate-900 dark:to-slate-800">
      <RegisterForm />
      <LoginImage />
    </div>
  );
};

export default Register;
