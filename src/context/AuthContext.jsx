// ═══════════════════════════════════════════════════════════════
//
// Provides { user, login, logout, loading } to the whole app.
// Wrap <App /> with <AuthProvider> in main.jsx.
// ═══════════════════════════════════════════════════════════════

import React, { useState, useCallback, useEffect } from "react";
import { getCurrentUser, refreshAuthToken, signOut } from "../services/authService";
import { AuthContext } from "./authContext";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await refreshAuthToken();
        setUser(getCurrentUser());
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

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
