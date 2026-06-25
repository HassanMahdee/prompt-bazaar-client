// src/components/RoleRoute.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export function RoleRoute({ children, allowedRoles }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 1. If loading, do nothing
    if (isPending) return;

    // 2. If no session, go to login
    if (!session) {
      router.replace("/login");
      return;
    }

    // 3. If session exists but role is not allowed, go home
    if (!allowedRoles.includes(session.user.role)) {
      router.replace("/"); // Or redirect to '/403'
    }
  }, [session, isPending, router, allowedRoles]);

  // Still loading? Show the spinner.
  if (isPending) {
    return <LoadingSpinner />;
  }

  // If authorized, show the content.
  if (session && allowedRoles.includes(session.user.role)) {
    return <>{children}</>;
  }

  return null;
}
