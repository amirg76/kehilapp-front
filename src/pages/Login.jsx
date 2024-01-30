//smart component
import React from "react";
import LoginImage from "@features/authentication/components/LoginImage/LoginImage";
import LoginForm from "@features/authentication/components/LoginForm/LoginForm";

import { useNavigate } from "react-router-dom";

const Login = () => {
  //* Simulate authentication logic (replace with your actual authentication logic)
  const navigate = useNavigate();
  const authenticateUser = (email, password) => {
    if (email === "user@example.com" && password === "user@example.com") {
      // Navigate to main page
      navigate("/messages");
    } else {
      console.log("wrong credentials");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-[#EFEFEF] ">
        <LoginForm onLogin={authenticateUser} />
        <LoginImage />
      </div>
    </>
  );
};

export default Login;
