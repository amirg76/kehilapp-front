import { useState, useEffect } from "react";

// api url
import { MESSAGES_URL } from "@api/apiConstants.js";
//redux use functions
import { useDispatch, useSelector } from "react-redux";

//redux actions
import { messageActions } from "@store/slices/messageSlice";
import { loadingActions } from "@store/slices/loadingSlice";
const useFetchData = (searchTerm = "") => {
  const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages);
  const loading = useSelector((state) => state.loading.active);

  useEffect(() => {
    if (searchTerm) {
      fetchQuery(searchTerm);
    }
  }, [searchTerm]);
  const fetchQuery = async (searchTerm) => {
    try {
      dispatch(loadingActions.toggle());
      const response = await fetch(
        `${MESSAGES_URL}/search?searchTerm=${searchTerm}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //
      if (response.ok) {
        let json = await response.json();

        setData(json.data);
        dispatch(loadingActions.toggle());
        dispatch(messageActions.loadMessages(json.data));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return data;
};
export default useFetchData;
