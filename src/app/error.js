"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center p-8">
        <div className="text-6xl text-error mb-4">
          <FaExclamationTriangle />
        </div>
        <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-lg text-base-content/70 mb-8">
          We apologize for the inconvenience. An unexpected error has occurred.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="btn btn-primary"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="btn btn-outline"
          >
            <FaHome className="mr-2" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
