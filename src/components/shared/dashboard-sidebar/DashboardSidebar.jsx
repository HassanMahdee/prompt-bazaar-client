"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import {
  FaUser,
  FaBookmark,
  FaPlus,
  FaEdit,
  FaUsers,
  FaClipboardList,
  FaFlag,
  FaUserShield,
  FaStar,
  FaChartBar,
} from "react-icons/fa";

const DashboardSidebar = ({ activeTab, onTabChange, dashboardType }) => {
  const { data: session } = useSession();

  const userMenu = [
    { key: "saved", label: "Saved Prompts", icon: FaBookmark },
    { key: "my-reviews", label: "My Reviews", icon: FaStar },
    { key: "profile", label: "Profile", icon: FaUser },
  ];

  const creatorMenu = [
    { key: "create-prompt", label: "Create Prompt", icon: FaPlus },
    { key: "my-prompts", label: "My Prompts", icon: FaEdit },
  ];

  const adminMenu = [
    { key: "analytics", label: "Analytics", icon: FaChartBar },
    { key: "users", label: "All Users", icon: FaUsers },
    { key: "all-prompts", label: "All Prompts", icon: FaClipboardList },
    { key: "payments", label: "All Payments", icon: FaFlag },
    { key: "reports", label: "Reported Prompts", icon: FaFlag },
  ];

  const menuItems =
    dashboardType === "creator"
      ? creatorMenu
      : dashboardType === "admin"
        ? adminMenu
        : userMenu;

  const roleColors = {
    admin: "badge-error",
    creator: "badge-primary",
    user: "badge-secondary",
  };

  return (
    <aside className="w-64 h-screen flex flex-col bg-base-100 border-r border-base-200">
      {/* Brand / Logo */}
      <div className="px-6 py-5 border-b border-base-200">
        <Link
          href="/"
          className="text-xl font-bold text-primary flex items-center gap-2"
        >
          Prompt-Bazaar
        </Link>
      </div>

      {/* User Profile */}
      <div className="px-6 py-5 border-b border-base-200">
        <div className="flex items-center gap-3">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-12">
              <span className="text-lg">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-base-content text-sm font-bold truncate leading-tight">
              {session?.user?.name}
            </p>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${roleColors[session?.user?.role] || "badge-secondary"}`}
            >
              {session?.user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow overflow-y-auto px-3 py-4 space-y-1">
        <p className="text-[10px] text-base-content/50 font-bold uppercase tracking-widest px-3 pb-2">
          Navigation
        </p>
        {menuItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onTabChange?.(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left ${
              activeTab === key
                ? "bg-primary text-primary-content"
                : "text-base-content/70 hover:text-base-content hover:bg-base-200"
            }`}
          >
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                activeTab === key
                  ? "bg-primary-content/20 text-primary-content"
                  : "bg-base-200 text-base-content/70"
              }`}
            >
              <Icon size={16} />
            </span>
            <span>{label}</span>
          </button>
        ))}

        {/* Role-specific links */}
        {dashboardType === "user" &&
          (session?.user?.role === "creator" ||
            session?.user?.role === "admin") && (
            <Link
              href="/dashboard/creator"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left text-base-content/70 hover:text-base-content hover:bg-base-200"
            >
              <span className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
                <FaPlus size={16} />
              </span>
              <span>Creator Dashboard</span>
            </Link>
          )}

        {dashboardType === "user" && session?.user?.role === "admin" && (
          <Link
            href="/dashboard/admin"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left text-base-content/70 hover:text-base-content hover:bg-base-200"
          >
            <span className="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center shrink-0">
              <FaUserShield size={16} />
            </span>
            <span>Admin Dashboard</span>
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
