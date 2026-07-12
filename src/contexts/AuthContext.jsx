import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function decodeRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { role: payload.role, name: payload.name, exp: payload.exp };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('transitops_token'));

  const user = useMemo(() => (token ? decodeRoleFromToken(token) : null), [token]);

  const login = (newToken) => {
    localStorage.setItem('transitops_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('transitops_token');
    setToken(null);
  };

  const value = { token, user, isAuthenticated: !!token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
