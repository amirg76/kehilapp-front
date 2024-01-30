//smart component
import React from "react";
import LoginImage from "@features/authentication/components/LoginImage/LoginImage";
import LoginForm from "@features/authentication/components/LoginForm/LoginForm";

import { useAuth } from "@features/authentication/hooks/useAuth";

const Login = ({ onLogin }) => {
  const { login } = useAuth();
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-[#EFEFEF] ">
        <LoginForm onLogin={onLogin} />
        <LoginImage />
      </div>
    </>
  );
};

export default Login;
