import { useState, useCallback, useEffect } from "react";

let logOutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  //login authCtx () => {}, setting token and storing into ls
  const login = useCallback((uid, token, expirationDate) => {
    setToken(token); //set token
    //use this later for reload save data logic
    setUserId(uid);
    //check if we have an existing exp data or dont then we generate one
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60); //1hr+ from curTime
    setTokenExpirationDate(tokenExpirationDate); //derived above in the const not our state variable this is the shadow var
    localStorage.setItem(
      "userData", //dynaimc key for our users used a lot with the backend logic look out for it
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  //generate token expiration
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime(); //get the duration in milliseconds
      logOutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logOutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  //check if the user is logged in when we initial start or reload the application
  useEffect(() => {
    //convert json string back into normal js data structures arrays objs strings etc
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date() //checks for token validity/exp based on the time
    ) {
      //ensure login will be executed with our uid and token if we have one in our ls
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration) //og saved expiration time stamp made when we login
      );
    }
  }, [login]);

  return { token, login, logout, userId};
};
