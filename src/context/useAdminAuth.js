import { useContext } from 'react';
import { AdminAuthContext } from './AdminAuthContextValue';

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be inside <AdminAuthProvider>');
  return ctx;
};
