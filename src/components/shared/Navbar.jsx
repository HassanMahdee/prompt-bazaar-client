"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  HiLightningBolt,
  HiMenuAlt3,
  HiX,
  HiUser,
  HiViewGrid,
  HiLogout,
} from "react-icons/hi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Button,
} from "@heroui/react";
// Import your Better Auth client configuration instance
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Better Auth reactive state hooks
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  const navLinks = [
    { name: "Explore Marketplace", href: "/prompts" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#090D16]/70 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo Zone */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-violet-600 to-amber-500 p-2 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:scale-105 transition-transform">
                <HiLightningBolt className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Prompt<span className="text-amber-500">Bazaar</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-amber-500 bg-white/5"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Authentication State Dynamic Render Matrix */}
          <div className="hidden md:flex items-center gap-4">
            {isPending ? (
              <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-violet-500 animate-spin" />
            ) : session ? (
              /* Authenticated User Actions: HeroUI Engine Dropdown Components */
              <Dropdown
                placement="bottom-end"
                className="bg-[#111827] border border-white/10 text-white"
              >
                <DropdownTrigger>
                  <button className="focus:outline-none transition-transform hover:scale-105">
                    <Avatar
                      isBordered
                      as="div"
                      className="transition-transform ring-2 ring-violet-500"
                      color="secondary"
                      name={session.user.name}
                      size="sm"
                      src={session.user.image || undefined}
                    />
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem
                    key="profile"
                    className="h-14 gap-2 opacity-100 cursor-default hover:bg-transparent text-slate-400"
                  >
                    <p className="text-xs">Signed in as</p>
                    <p className="font-semibold text-white text-sm truncate">
                      {session.user.email}
                    </p>
                  </DropdownItem>
                  <DropdownItem
                    key="dashboard"
                    startContent={
                      <HiViewGrid className="w-4 h-4 text-violet-400" />
                    }
                    onClick={() => router.push("/dashboard")}
                    className="hover:bg-violet-600/20 text-slate-200"
                  >
                    Control Dashboard
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    className="text-rose-400 hover:bg-rose-600/20"
                    startContent={<HiLogout className="w-4 h-4" />}
                    onClick={handleLogout}
                  >
                    Sign Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              /* Anonymous Guest Action Links */
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white text-sm font-medium px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Button
                  as={Link}
                  href="/register"
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-[0_4px_12px_rgba(124,58,237,0.3)]"
                >
                  Join Bazaar
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Breakpoint Action Selector Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-white focus:outline-none p-1"
            >
              {isMobileMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenuAlt3 className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Context Menu Drawer Layer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#090D16] px-4 pt-2 pb-4 space-y-2 transform origin-top transition-all duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10">
            {session ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar
                    size="sm"
                    src={session.user.image || undefined}
                    name={session.user.name}
                  />
                  <span className="text-slate-200 text-sm font-medium truncate">
                    {session.user.name}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                >
                  <HiViewGrid className="w-5 h-5 text-violet-400" /> Control
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
                >
                  <HiLogout className="w-5 h-5" /> Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 px-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center px-4 py-2 border border-white/10 rounded-xl text-slate-300 text-sm font-medium hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white text-sm font-semibold shadow-md transition-all"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
