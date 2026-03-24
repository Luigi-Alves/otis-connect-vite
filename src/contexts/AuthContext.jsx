// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();
const STORAGE_KEY = "otisconnect_user";

const DEFAULT_USERS = {
  client: { id: 13, name: "João Silva", role: "client", email: "joao.silva@client.com" }, // ID corresponde ao customerId
  sales: { id: "user_sales_001", name: "Maria Santos", role: "sales", email: "maria.santos@otis.com" },
  field: { id: "user_field_001", name: "Carlos Oliveira", role: "field", email: "carlos.oliveira@otis.com" },
  quality: { id: "user_quality_001", name: "Ana Costa", role: "quality", email: "ana.costa@otis.com" },
  supervisor: { id: "user_supervisor_001", name: "Roberto Ferreira", role: "supervisor", email: "roberto.ferreira@otis.com" },
  admin: { id: "user_admin_001", name: "Administrador", role: "admin", email: "admin@otis.com" },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega usuário salvo
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((role) => {
    const selectedUser = DEFAULT_USERS[role];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedUser));
    setUser(selectedUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const isAuthenticated = !!user;

  const hasRole = useCallback(
    (roles) => roles.includes(user?.role),
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}