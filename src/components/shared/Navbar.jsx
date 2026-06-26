"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiX, HiChevronDown, HiOutlineCube, HiArrowRight } from "react-icons/hi";
import { authClient } from "@/lib/auth-client"; // Aligned with Better Auth integration setups
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Real-time hook listener evaluating the active user session status
  const { data: session, isPending } = authClient.useSession();

  const navLinks = [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Analytics Dashboard", href: "/analytics" },
    { name: "Developer Docs", href: "/docs" },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-obsidian/70 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Identity Branding Frame */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-electric to-indigo-600 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                <HiOutlineCube className="w-5 h-5 text-white transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="font-display text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-gold bg-clip-text text-transparent">
                PROMPT<span className="text-violet-electric font-extrabold">BAZAAR</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Link Arrays */}
          <nav className="hidden md:flex items-center gap-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs lg:text-sm font-medium tracking-wide transition-all relative py-2 ${
                    isActive 
                      ? "text-white font-semibold" 
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-electric to-amber-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Identity/Action Area Matrix */}
          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <div className="h-8 w-20 bg-white/5 rounded-lg animate-pulse" />
            ) : session ? (
              /* Profile Context Sub-Menu Dropdown Control */
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer">
                  <Image 
                    src={session?.user?.image || "https://api.dicebear.com/7.x/bottts/svg"} 
                    alt={session?.user?.name} 
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-lg border border-violet-electric/40 bg-obsidian-light object-cover"
                  />
                  <HiChevronDown className="w-4 h-4 text-slate-400" />
                </div>
                <ul tabIndex={0} className="dropdown-content z-50 menu p-2 mt-2 shadow-2xl bg-obsidian-light border border-white/5 rounded-xl w-52 text-slate-300 font-sans text-xs space-y-1">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-white font-semibold truncate text-[13px]">{session?.user?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{session?.user?.email}</p>
                  </div>
                  <li><Link href="/profile" className="hover:bg-white/5 hover:text-white py-2 rounded-lg">User Profile</Link></li>
                  <li><Link href="/my-prompts" className="hover:bg-white/5 hover:text-white py-2 rounded-lg">Saved Shells</Link></li>
                  <li>
                    <button onClick={handleLogout} className="text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors py-2 rounded-lg">
                      Disconnect Node
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs rounded-xl transition-all"
              >
                Access Matrix
                <HiArrowRight className="w-3.5 h-3.5 text-amber-gold" />
              </Link>
            )}
          </div>

          {/* Right Mobile System Menu Interface Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Shell"
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white active:scale-95 transition-all"
            >
              {isMobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Slide-Down Mobile Responsive Menu Modal Screen overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-obsidian-light border-b border-white/10 px-4 py-6 space-y-4 shadow-2xl md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    isActive 
                      ? "bg-violet-electric/10 text-white border border-violet-electric/20" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/5 px-2">
            {session ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={session?.user?.image || "https://api.dicebear.com/7.x/bottts/svg"} 
                    alt={session?.user?.name} 
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-xl border border-violet-electric/40 bg-obsidian object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{session?.user?.name}</p>
                    <p className="text-xs text-slate-400">{session?.user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-center px-3 py-2.5 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-xl text-white transition-all"
                  >
                    Console
                  </Link>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                    className="px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold rounded-xl text-rose-400 transition-all"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-electric to-indigo-600 text-white font-semibold text-sm rounded-xl shadow-lg"
              >
                Access System Matrix
                <HiArrowRight className="w-4 h-4 text-amber-gold" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}