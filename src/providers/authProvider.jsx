// src/providers/AuthProvider.jsx
"use client";

import { createContext, useContext } from "react";
import { useSession } from "@/lib/auth-client"; // Path where your Better Auth client is initialized
import { LoadingSpinner } from "@/components/LoadingSpinner";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Better Auth's useSession returns isPending (bool) and data (session)
  const { data: session, isPending } = useSession();

  // CRITICAL: Prevent render until we know the auth state
  if (isPending) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ session, isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};