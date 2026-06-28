"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaBookmark,
  FaUser,
  FaSignOutAlt,
  FaStar,
  FaPlus,
} from "react-icons/fa";
import { get, del } from "@/lib/api";
import Link from "next/link";

export default function UserDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [bookmarks, setBookmarks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasLoadedProfile = useRef(false);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get("/bookmarks");
      setBookmarks(data.data || []);
    } catch (err) {
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get(`/user?email=${session?.user?.email}`);
      console.log("User profile data:", data);
      setUserProfile(data);
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [session]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "saved") {
      fetchBookmarks();
    } else if (tab === "profile") {
      fetchUserProfile();
    }
  };

  useEffect(() => {
    if (session && !hasLoadedProfile.current) {
      hasLoadedProfile.current = true;
      setTimeout(() => fetchUserProfile(), 0);
    }
  }, [session, fetchUserProfile]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleRemoveBookmark = async (promptId) => {
    try {
      await del(`/bookmarks/${promptId}`);
      toast.success("Bookmark removed");
      fetchBookmarks();
    } catch (err) {
      toast.error("Failed to remove bookmark");
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="container-xy">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex flex-col items-center mb-6">
                  <div className="avatar placeholder mb-3">
                    <div className="bg-neutral text-neutral-content rounded-full w-20">
                      <span className="text-2xl">
                        {session?.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold">{session?.user?.name}</h2>
                  <p className="text-sm text-base-content/70">
                    {session?.user?.email}
                  </p>
                  <div className="badge badge-primary mt-2">
                    {session?.user?.role}
                  </div>
                  <div className="badge badge-secondary mt-1">
                    {session?.user?.subscription}
                  </div>
                </div>

                <div className="divider"></div>

                <ul className="menu menu-vertical bg-base-200 rounded-box">
                  <li>
                    <a
                      className={activeTab === "profile" ? "active" : ""}
                      onClick={() => handleTabChange("profile")}
                    >
                      <FaUser className="mr-2" />
                      Profile
                    </a>
                  </li>
                  <li>
                    <a
                      className={activeTab === "saved" ? "active" : ""}
                      onClick={() => handleTabChange("saved")}
                    >
                      <FaBookmark className="mr-2" />
                      Saved Prompts
                    </a>
                  </li>
                  {(session?.user?.role === "creator" ||
                    session?.user?.role === "admin") && (
                    <li>
                      <Link
                        href="/dashboard/creator"
                        className="flex items-center gap-2"
                      >
                        <FaPlus className="mr-2" />
                        Creator Dashboard
                      </Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="text-error">
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "profile" && (
              <>
                <div className="card bg-base-100 shadow-lg mb-6">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Profile</h2>
                    {userProfile ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-20">
                              <span className="text-2xl">
                                {userProfile.name?.charAt(0).toUpperCase() ||
                                  "U"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {userProfile.name}
                            </h3>
                            <p className="text-base-content/70">
                              {userProfile.email}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="stat bg-base-200 rounded-lg">
                            <div className="stat-title">Role</div>
                            <div className="stat-value text-lg">
                              {userProfile.role}
                            </div>
                          </div>
                          <div className="stat bg-base-200 rounded-lg">
                            <div className="stat-title">Subscription</div>
                            <div className="stat-value text-lg">
                              {userProfile.subscription}
                            </div>
                          </div>
                          <div className="stat bg-base-200 rounded-lg">
                            <div className="stat-title">Total Prompts</div>
                            <div className="stat-value text-lg">
                              {userProfile.promptCount || 0}
                            </div>
                          </div>
                        </div>
                        {userProfile.subscription === "free" && (
                          <div className="alert alert-info mt-4">
                            <div className="flex items-center justify-between">
                              <span>
                                Upgrade to Premium for unlimited access
                              </span>
                              <button
                                onClick={() => router.push("/payment")}
                                className="btn btn-primary btn-sm"
                              >
                                Upgrade
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="loading loading-spinner"></span>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "saved" && (
              <>
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Saved Prompts</h2>
                    {loading ? (
                      <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                      </div>
                    ) : bookmarks.length === 0 ? (
                      <p className="text-base-content/70 text-center py-12">
                        No saved prompts yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {bookmarks.map((prompt) => (
                          <div
                            key={prompt._id}
                            className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                          >
                            <div className="flex-1">
                              <h4 className="font-semibold">{prompt.title}</h4>
                              <p className="text-sm text-base-content/70">
                                {prompt.aiTool} • {prompt.category}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Link
                                href={`/prompts/${prompt._id}`}
                                className="btn btn-sm btn-outline"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleRemoveBookmark(prompt._id)}
                                className="btn btn-sm btn-error"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
