// src/components/PrivateRoute.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client"; // Ensure this matches your path
import { LoadingSpinner } from "@/components/LoadingSpinner";

export function PrivateRoute({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if loading is finished AND there is no session
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  // Still loading? Show the spinner.
  if (isPending) {
    return <LoadingSpinner />;
  }

  // If we have a session, show the content.
  if (session) {
    return <>{children}</>;
  }

  // Return null or empty fragment while the redirect is being processed
  return null;
}
