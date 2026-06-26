"use client";

import { useEffect } from "react";
import { HiRefresh, HiShieldExclamation } from "react-icons/hi";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("CRITICAL CLIENT EXCEPTION INTERCEPT:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] w-full flex items-center justify-center px-4 sm:px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-[500px] sm:h-[500px] bg-rose-600/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />

      <div className="max-w-md md:max-w-lg w-full bg-obsidian-light border border-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center shadow-2xl space-y-5 sm:space-y-6">
        {/* Warning Indicator */}
        <div className="inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <HiShieldExclamation className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
            Application Shell Interrupted
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed px-2">
            A state management fault or unexpected response broke the current
            render layout. The main stack remains securely operational.
          </p>
        </div>

        {/* Technical Trace Window */}
        <div className="bg-obsidian-deep border border-white/5 rounded-xl p-3 sm:p-4 text-left max-h-28 sm:max-h-36 overflow-y-auto custom-scrollbar">
          <code className="text-[10px] sm:text-xs font-mono text-rose-400/90 break-all leading-normal">
            {error?.message || "Unknown Exception Instance Tracked"}
          </code>
        </div>

        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <HiRefresh className="w-4 h-4 text-amber-gold" />
            Rehydrate UI View
          </button>
        </div>
      </div>
    </main>
  );
}
