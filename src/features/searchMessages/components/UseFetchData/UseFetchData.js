import { useState, useEffect } from "react";

// api url
import { MESSAGES_URL } from "@api/apiConstants.js";

const useFetchData = (searchTerm = "") => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (searchTerm) {
      fetchQuery(searchTerm);
    }
  }, [searchTerm]);
  const fetchQuery = async (searchTerm) => {
    try {
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
        let data = await response.json();

        setData(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return [data, isLoading];
};
export default useFetchData;
