import { useState, useCallback, useRef, useEffect } from "react";
export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //cleanup cleanup
  //never continue with a request when it's on their way out when the component changes from the one that triggers the request
  const activeHttpRequests = useRef([]); //store request data across rerender cycles here into this arr

  //forward all params to fetch
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      //allows us to abort dom requests
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method: method,
          body: body,
          headers: headers,
          signal: httpAbortCtrl.signal, //cancels connected requests
        });

        //parse data object from incoming response
        const responseData = await response.json();

        //clear abort controllers that belong to the request that just completed
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          //checks for 400 + errors so it wont redirect
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  //makes sure we never keep a requesting running when canceled/switched out
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((aborCtrl) => aborCtrl.abort());
    };
  }, []);

  return {
    isLoading: isLoading,
    error: error,
    sendRequest: sendRequest,
    clearError: clearError,
  };
};
