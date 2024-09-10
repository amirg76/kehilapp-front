//smart component
import React from "react";
import LoginRegisterImage from "@features/authentication/components/LoginRegisterImage/LoginRegisterImage";

import leftImg from "@features/authentication/components/img/image1.png";
import AuthForm from "../features/authentication/components/AuthForm/AuthForm";

const Register = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-gradient-to-b from-[#EFEFEF] to-white">
        {/* <RegisterForm /> */}
        <AuthForm type="register" />
        <LoginRegisterImage img={leftImg} />
      </div>
    </>
  );
};

export default Register;
