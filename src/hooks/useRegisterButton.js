import { useCallback } from "react";
/**
 * A custom hook that returns the props for a register button.
 *
 * @param {function} handleRegister - A callback function to handle register.
 * @param {boolean} isLogin - A boolean indicating whether the user is logged in.
 * @return {object} An object containing the onClick event handler, CSS class name, and button text.
 */
const useRegisterButton = (handleRegister, isLogin) => {
  const onClickRegisterButton = useCallback(() => {
    !isLogin && handleRegister();
  }, [handleRegister, isLogin]);

  return {
    onClickRegisterButton,
    registerClassName: isLogin
      ? "display-none"
      : "rounded-lg border-2 border-solid border-4870ad py-3 px-8 text-000000 border-backgroundButton text-center font-assistant font-semibold text-sm leading-5 ",
    registerChildren: "הרשמה",
  };
};

export default useRegisterButton;
