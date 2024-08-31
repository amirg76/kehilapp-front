import React from "react";
// import leftImg from "../../img/image1.png";
const LoginRegisterImage = ({ img }) => {
  {
    /* Image on the Left */
  }
  return (
    <div
      className="md:w-1/2 bg-cover bg-center"
      style={{ backgroundImage: `url(${img})` }}
    ></div>
  );
};

export default LoginRegisterImage;
