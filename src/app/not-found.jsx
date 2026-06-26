import Link from "next/link";
import { HiArrowLeft, HiOutlineQuestionMarkCircle } from "react-icons/hi";

export const metadata = {
  title: "404 - Lost in the Void | Prompt Bazaar",
  description:
    "The prompt matrix or marketplace route you are searching for does not exist.",
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] w-full flex items-center justify-center px-4 relative overflow-hidden">
      {/* Responsive Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-violet-electric/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-amber-gold/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none animate-pulse delay-700" />

      <div className="max-w-md w-full text-center relative z-10 space-y-6 sm:space-y-8 px-2">
        {/* Floating Icon Frame */}
        <div className="inline-flex p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-violet-electric to-amber-gold rounded-2xl sm:rounded-3xl opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
          <HiOutlineQuestionMarkCircle className="w-12 h-12 sm:w-16 sm:h-16 text-amber-gold relative z-10 animate-bounce" />
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h1 className="font-display text-6xl sm:text-8xl font-extrabold tracking-tighter bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="font-display text-lg sm:text-2xl font-bold text-slate-200 tracking-tight">
            Prompt Missing From Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xs sm:max-w-sm mx-auto">
            The structural route or parameters you requested have drifted into
            deep space. Let's redirect your system shell back home.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-electric to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <HiArrowLeft className="w-4 h-4" />
            Return to Marketplace
          </Link>
        </div>
      </div>
    </main>
  );
}
