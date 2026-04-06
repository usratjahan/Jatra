import React, { useState, useCallback } from "react";
import { AdminAuthContext } from "./AdminAuthContextValue";

const ADMIN_SESSION_KEY = "jatra_admin_session";

// Mock admin accounts — TODO: replace with GET /api/admin/signin
const MOCK_ADMINS = [
  //   {
  //     id: 1,
  //     name: 'Md Anowarul Abedin',
  //     email: 'admin@example.com',
  //     password: 'admin123',
  //     role: 'Super Admin',
  //     phone: '01711111111',
  //     whatsapp: '01711111111',
  //     dob: '1990-05-15',
  //     attendance: '22 Days',
  //     status: 'Active',
  //     salary: '50,000',
  //   },
  {
    id: 2,
    name: "Usrat Jahan",
    email: "usratjahan233@gmail.com",
    password: "usrat233",
    role: "Admin",
    phone: "01722222222",
    whatsapp: "01722222222",
    dob: "2003-01-12",
    attendance: "2 Days",
    status: "Active",
    salary: "30,000",
  },
];

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY));
    } catch {
      return null;
    }
  });

  const adminLogin = useCallback(async ({ email, password }) => {
    // TODO: replace with → POST /api/admin/signin
    await new Promise((r) => setTimeout(r, 500));
    const found = MOCK_ADMINS.find(
      (a) => a.email === email && a.password === password,
    );
    if (!found) throw new Error("Invalid email or password.");
    const { password: _pw, ...safeAdmin } = found;
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(safeAdmin));
    setAdmin(safeAdmin);
    return safeAdmin;
  }, []);

  const adminLogout = useCallback(() => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAdmin(null);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{ admin, adminLogin, adminLogout, MOCK_ADMINS }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
