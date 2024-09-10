//smart component
import React from "react";

import leftImg from "@features/authentication/components/img/image1.png";
import LoginRegisterImage from "../features/authentication/components/LoginRegisterImage/LoginRegisterImage";
import AuthForm from "../features/authentication/components/AuthForm/AuthForm";
const Login = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-gradient-to-b from-[#EFEFEF] to-white">
        <AuthForm type="login" />
        <LoginRegisterImage img={leftImg} />
      </div>
    </>
  );
};

export default Login;
