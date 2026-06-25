import { createAuthClient } from "better-auth/react";

// Initialize the auth client using the backend URL from your environment variables
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Export hooks for easy access in components
export const { useSession, signIn, signUp, signOut } = authClient;
