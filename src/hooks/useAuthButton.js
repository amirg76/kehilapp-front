import { useCallback } from "react";

/**
 * A custom hook that returns the props for an authentication button.
 *
 * @param {function} handleLogout - A callback function to handle logout.
 * @param {function} handleLogin - A callback function to handle login.
 * @param {boolean} isLogin - A boolean indicating whether the user is logged in.
 * @return {object} An object containing the onClick event handler, CSS class name, and button text.
 */
const useAuthButton = (handleLogout, handleLogin, isLogin) => {
  const onClickAuthButton = useCallback(() => {
    isLogin ? handleLogout() : handleLogin();
  }, [handleLogin, handleLogout, isLogin]);

  return {
    onClickAuthButton,
    className:
      "rounded-lg border-2 border-solid border-4870ad py-3 px-8 text-000000 border-backgroundButton text-center font-assistant font-semibold text-sm leading-5",
    children: isLogin ? "התנתק" : "התחבר",
  };
};

export default useAuthButton;
