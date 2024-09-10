import { authActions } from "@store/slices/authSlice";
import { MESSAGES } from "@routes/routeConstants";
import { updateErrorMessage } from "@features/authentication/helpers/authErrors";

/**
 * Handles the success response from the server.
 *
 * @param {Object} data - The data object containing information about the success response.
 * @param {Function} setErrorMessage - The function to update the error message.
 * @param {Function} dispatch - The dispatch function.
 * @param {Function} navigate - The navigate function.
 * @param {String} type - The type of authentication.
 * @return {void}
 */
export const handleSuccess = (
  data,
  setErrorMessage,
  dispatch,
  navigate,
  type
) => {
  const handleAuthError = (status) => {
    updateErrorMessage(status, setErrorMessage);
  };

  const handleNormalResponse = () => {
    sessionStorage.setItem("loggedInUser", JSON.stringify(data));
    dispatch(authActions[type](data));
    navigate(MESSAGES);
  };

  const status = data?.error?.status;
  if (status === 404 || status === 401 || status === 409) {
    handleAuthError(status);
  } else {
    handleNormalResponse();
  }
};
