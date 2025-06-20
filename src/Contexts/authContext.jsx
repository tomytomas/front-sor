import {
  createContext,
  useMemo,
  useState,
  useCallback,
  useContext,
} from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  //URL API
  //const base = import.meta.env.VITE_BASE_URL;

  const [isAuthenticated, setIsAuthenticaded] = useState(false);

  const [isAdminAuthenticated, setIsAdminAuthenticaded] = useState(false);

  const [globalToken, setGlobalToken] = useState({});

  const [globalAdminToken, setAdminGlobalToken] = useState({});

  
  const signIn = useCallback(function (token) {
    sessionStorage.setItem("user", true);
    setGlobalToken(token);
    setIsAuthenticaded(true);
  }, []);

  const Admin = useCallback(function (token) {
    sessionStorage.setItem("admin", true);
    sessionStorage.setItem("admin2", token);
    setAdminGlobalToken(token);
    setIsAdminAuthenticaded(true);
  }, []);

  const Logout = useCallback(async function () {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("admin");
    setIsAuthenticaded(false);
    setIsAdminAuthenticaded(false);
    setGlobalToken("");
    setAdminGlobalToken("");
  }, []);

  const value = useMemo(
    () => ({
      signIn,
      Admin,
      Logout,
      isAuthenticated,
      isAdminAuthenticated,
      globalToken,
      globalAdminToken,
    }),
    [
      signIn,
      Admin,
      Logout,
      isAuthenticated,
      isAdminAuthenticated,
      globalToken,
      globalAdminToken,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthContextProvider.propTypes = {
  children: PropTypes.object,
};

export function useAuthContext() {
  return useContext(AuthContext);
}
