//smart component
import React from "react";
import LoginRegisterImage from "@features/authentication/components/LoginRegisterImage/LoginRegisterImage";
import RegisterForm from "@features/authentication/components/RegisterForm/RegisterForm";
import leftImg from "@features/authentication/components/img/image1.png";

const Register = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-gradient-to-b from-[#EFEFEF] to-white">
        <RegisterForm />
        <LoginRegisterImage img={leftImg} />
      </div>
    </>
  );
};

export default Register;
