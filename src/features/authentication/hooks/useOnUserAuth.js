import { MESSAGES } from "@routes/routeConstants";
import { useDispatch } from "react-redux";
// redux
import { authActions } from "@store/slices/authSlice";
export const useOnUserAuth = ({ user, type }) => {
  const dispatch = useDispatch();
  console.log(user);
  // Set user information in session storage
  sessionStorage.setItem("loggedInUser", JSON.stringify(user));
  // Dispatch the register action with user information
  dispatch(
    type === "register" ? authActions.register(user) : authActions.login(user)
  );
  // Navigate to main page
  navigate(MESSAGES);
};
