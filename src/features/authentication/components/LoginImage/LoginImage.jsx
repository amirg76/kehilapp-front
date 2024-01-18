import React from "react";
import leftImg from "../img/image1.png";
const LoginImage = () => {
  {
    /* Image on the Left */
  }
  return (
    <div
      className="md:w-1/2 bg-cover bg-center"
      style={{ backgroundImage: `url(${leftImg})` }}
    ></div>
  );
};

export default LoginImage;
