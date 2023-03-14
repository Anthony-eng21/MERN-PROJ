import { createContext } from "react";
//shared object among the components and everytime it's listened to it will update some state in our components
export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
});
