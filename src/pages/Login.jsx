//smart component
import React from "react";
import LoginImage from "@features/authentication/components/LoginImage/LoginImage";
import LoginForm from "@features/authentication/components/LoginForm/LoginForm";

const Login = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-gradient-to-b from-[#EFEFEF] to-white">
       <LoginForm />
       <LoginImage />
       </div>
       </>
       );
      };
      
      export default Login;
      