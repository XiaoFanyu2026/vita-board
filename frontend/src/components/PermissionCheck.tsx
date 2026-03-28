import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

interface Props {
  code: string;
  children: React.ReactNode;
}

export const PermissionCheck: React.FC<Props> = ({ code, children }) => {
  const { hasPermission } = useAuthStore();
  if (!hasPermission(code)) return null;
  return <>{children}</>;
};
