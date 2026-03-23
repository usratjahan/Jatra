// ═══════════════════════════════════════════════════════════════
//
// Provides { user, login, logout, loading } to the whole app.
// Wrap <App /> with <AuthProvider> in main.jsx.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useCallback } from "react";
import { getCurrentUser, signOut } from "../services/authService";
import { AuthContext } from "./authContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getCurrentUser());

  // Call this after a successful signIn / signUp
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  // Call this to log out
  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
