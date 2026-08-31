//smart component
import React from "react";
import LoginImage from "@features/authentication/components/LoginImage/LoginImage";
import LoginForm from "@features/authentication/components/LoginForm/LoginForm";

const Login = () => {
  return (
    // min-h-screen (not h-screen): the card grows past the viewport on short
    // screens, and a fixed height clipped the cross-link at the bottom.
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-b from-[#EFEFEF] to-white dark:from-slate-900 dark:to-slate-800">
      <LoginForm />
      <LoginImage />
    </div>
  );
};

export default Login;
