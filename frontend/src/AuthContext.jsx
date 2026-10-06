import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("teacherAuth")) || null;
    } catch {
      return null;
    }
  });

  const login = (data) => {
    setAuth(data); // { token, teacher }
    localStorage.setItem("teacherAuth", JSON.stringify(data));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("teacherAuth");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
