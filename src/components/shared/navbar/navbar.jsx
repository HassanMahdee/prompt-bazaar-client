"use client";

import Link from "next/link";
import { NavPath } from "./navbarPath";
import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/all-prompts", label: "All Prompts" },
];

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="navbar backdrop-blur-md bg-base-100/80 sticky top-0 z-50 border-b border-base-300 px-4 lg:px-10">
      <div className="navbar-start">
        <Link
          href="/"
          className="flex items-center gap-2 text-primary font-bold text-xl"
        >
          Prompt-Bazaar
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex gap-6">
        {publicLinks.map((link) => (
          <NavPath key={link.href} link={link} />
        ))}
        {session && (
          <NavPath link={{ href: "/dashboard", label: "Dashboard" }} />
        )}
      </div>
      <div className="navbar-end gap-2">
        {isPending ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : session ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="avatar cursor-pointer">
              <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <div className="bg-neutral text-neutral-content rounded-full w-full h-full flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-200 rounded-2xl z-1 w-52 p-2 shadow mt-2"
            >
              <li className="px-3 py-2 text-sm font-semibold text-base-content/60">
                {session.user?.name}
              </li>
              <li className="px-3 py-2 text-sm text-base-content/50">
                {session.user?.role}
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              {(session.user?.role === "creator" ||
                session.user?.role === "admin") && (
                <li>
                  <Link href="/dashboard/creator">Creator Dashboard</Link>
                </li>
              )}
              {session.user?.role === "admin" && (
                <li>
                  <Link href="/dashboard/admin">Admin Dashboard</Link>
                </li>
              )}
              <div className="divider my-0"></div>
              <li>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/login" className="btn btn-primary btn-sm rounded-full">
              Login
            </Link>
            <Link
              href="/register"
              className="btn btn-outline btn-sm rounded-full"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
