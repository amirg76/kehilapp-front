//smart component
import React from "react";
import LoginImage from "@features/authentication/components/LoginImage/LoginImage";
import LoginForm from "@features/authentication/components/LoginForm/LoginForm";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const Login = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-[#EFEFEF] ">
        <LoginForm />
        <LoginImage />
      </div>
    </>
  );
};

export default Login;
