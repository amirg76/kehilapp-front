//smart component
import React from "react";

import LoginForm from "@features/authentication/components/LoginForm/LoginForm";
import leftImg from "@features/authentication/components/img/image1.png";
import LoginRegisterImage from "../features/authentication/components/LoginRegisterImage/LoginRegisterImage";
const Login = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-gradient-to-b from-[#EFEFEF] to-white">
        <LoginForm />
        <LoginRegisterImage img={leftImg} />
      </div>
    </>
  );
};

export default Login;
