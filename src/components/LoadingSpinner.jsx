// src/components/LoadingSpinner.jsx
"use client";

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-obsidian-deep z-50">
      <div className="relative">
        {/* Amber Gold Spinner */}
        <div className="w-16 h-16 border-4 border-amber-gold border-t-transparent rounded-full animate-spin"></div>
        {/* Subtle Glow */}
        <div className="absolute inset-0 bg-violet-electric opacity-10 blur-xl rounded-full"></div>
      </div>
    </div>
  );
}
