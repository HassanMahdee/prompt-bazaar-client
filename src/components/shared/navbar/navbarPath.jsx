"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NavPath = ({ link }) => {
  const pathname = usePathname();
  const isActive = (path) => pathname === path;
  
  return (
    <Link
      key={link.href}
      href={link.href}
      className={`font-medium text-sm transition-colors ${isActive(link.href) ? "text-primary" : "text-base-content/70 hover:text-primary"}`}
    >
      {link.label}
    </Link>
  );
};