import { useDispatch } from "react-redux";
import { uiActions } from "@store/slices/uiSlice";
/**
 * A hook that returns a function to handle navbar actions.
 *
 * @param {string} actionType - The type of action to perform, either "open" or "close".
 * @return {function} A function that dispatches the corresponding ui action.
 */
const useNavbarHandler = (actionType) => {
  const dispatch = useDispatch();
  return () =>
    dispatch(uiActions[actionType === "open" ? "openModal" : "closeModal"]());
};
export default useNavbarHandler;
