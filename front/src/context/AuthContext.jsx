import { useState } from "react";
import { STORAGE_KEYS } from "@shared/constants.js";
import { AuthContext } from "./auth-context.js";

function readStoredAuth() {
  const storedToken = window.localStorage.getItem(STORAGE_KEYS.TOKEN);
  const storedUser = window.localStorage.getItem(STORAGE_KEYS.USER);

  if (!storedToken || !storedUser) {
    return { token: null, user: null };
  }

  try {
    return { token: storedToken, user: JSON.parse(storedUser) };
  } catch {
    window.localStorage.removeItem(STORAGE_KEYS.TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.USER);
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);
  const { token, user } = auth;

  const loginSuccess = (userData, jwt) => {
    setAuth({ token: jwt, user: userData });
    window.localStorage.setItem(STORAGE_KEYS.TOKEN, jwt);
    window.localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  const updateUser = (updatedUser) => {
    setAuth((prev) => ({ ...prev, user: updatedUser }));
    window.localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    window.localStorage.removeItem(STORAGE_KEYS.TOKEN);
    window.localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const value = {
    token,
    user,
    ready: true,
    isAuthenticated: Boolean(token && user),
    loginSuccess,
    updateUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
