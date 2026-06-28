"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaCrown, FaCheck, FaLock } from "react-icons/fa";
import { post } from "@/lib/api";

export default function PaymentPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await post("/payments/payment-checkout-session", {
        userEmail: session.user.email,
      });
      
      if (response.url) {
        window.location.href = response.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (err) {
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xy">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
          <p className="text-lg text-base-content/70">
            Unlock unlimited access to all premium prompts and features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-2">Free Plan</h2>
              <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal">/month</span></div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <FaCheck className="text-success" />
                  <span>Access to public prompts</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-success" />
                  <span>Save up to 10 bookmarks</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-success" />
                  <span>Basic search and filter</span>
                </li>
                <li className="flex items-center gap-2 text-base-content/50">
                  <FaLock className="text-error" />
                  <span>Access to premium prompts</span>
                </li>
                <li className="flex items-center gap-2 text-base-content/50">
                  <FaLock className="text-error" />
                  <span>Unlimited bookmarks</span>
                </li>
                <li className="flex items-center gap-2 text-base-content/50">
                  <FaLock className="text-error" />
                  <span>Priority support</span>
                </li>
              </ul>

              <button className="btn btn-outline btn-block" disabled>
                Current Plan
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="card bg-primary text-primary-content shadow-2xl">
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <h2 className="card-title text-2xl">Premium Plan</h2>
                <FaCrown className="text-yellow-300 text-2xl" />
              </div>
              <div className="text-4xl font-bold mb-6">$5<span className="text-lg font-normal">/one-time</span></div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <FaCheck className="text-yellow-300" />
                  <span>Access to all prompts</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-yellow-300" />
                  <span>Unlimited bookmarks</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-yellow-300" />
                  <span>Advanced search and filter</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-yellow-300" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-yellow-300" />
                  <span>Early access to new features</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheck className="text-yellow-300" />
                  <span>Ad-free experience</span>
                </li>
              </ul>

              <button
                onClick={handleUpgrade}
                disabled={loading || session?.user?.subscription === "premium"}
                className="btn btn-secondary btn-block"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : session?.user?.subscription === "premium" ? (
                  "Already Premium"
                ) : (
                  "Upgrade Now"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="alert alert-info max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <FaLock className="text-xl mt-1" />
              <div className="text-left">
                <h3 className="font-bold">Secure Payment</h3>
                <p className="text-sm">
                  Your payment is processed securely through Stripe. We never store your payment information.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-base-content/60">
          <p>Need help? Contact support at support@promptbazaar.com</p>
        </div>
      </div>
    </div>
  );
}
