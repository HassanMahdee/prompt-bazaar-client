"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { AiOutlineGoogle } from "react-icons/ai";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await authClient.signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      image: formData.photoURL || undefined,
    });
    if (error) {
      setError(error.message);
      console.error("Registration error:", error);
    }
    if (data) {
      router.push("/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    await authClient.signUp.social({
      provider: "google",
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4">
      <div className="card bg-base-100 shadow-2xl w-full max-w-md">
        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-center mb-6">
            Create Account
          </h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-field">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-field">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-field">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                minLength={8}
              />
            </div>

            <div className="form-field">
              <label className="label">
                <span className="label-text">Photo URL (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered w-full"
                value={formData.photoURL}
                onChange={(e) =>
                  setFormData({ ...formData, photoURL: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="divider">OR</div>

          <button
            onClick={handleGoogleSignIn}
            className="btn btn-outline w-full"
          >
            <AiOutlineGoogle />
            Sign up with Google
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
