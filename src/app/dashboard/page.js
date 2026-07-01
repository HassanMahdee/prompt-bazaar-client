"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import DashboardSidebar from "@/components/shared/dashboard-sidebar/DashboardSidebar";
import { get, del } from "@/lib/api";
import Link from "next/link";

export default function UserDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [bookmarks, setBookmarks] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const hasLoadedProfile = useRef(false);

  const fetchBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get(`/bookmarks/${session?.user?.email}`);
      setBookmarks(data.data || []);
    } catch (err) {
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  }, [session]);

 const setUserProfileData = () => {
    setUserProfile(session?.user);
  };
  
  const fetchMyReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get(`/analytics/user-summary/${userProfile?.email}`);
      setMyReviews(data.data.reviews || []);
    } catch (err) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "saved") {
      fetchBookmarks();
    } else if (tab === "my-reviews") {
      fetchMyReviews();
    } else {
      setUserProfileData();
    }
  };

  const handleRemoveBookmark = async (promptId) => {
    try {
      await del(`/bookmarks/${promptId}`);
      toast.success("Bookmark removed");
      setBookmarks(fetchBookmarks());
    } catch (err) {
      toast.error("Failed to remove bookmark");
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        dashboardType="user"
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-base-200 p-8">
        {activeTab === "my-reviews" && (
          <>
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">My Reviews</h2>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : myReviews.length === 0 ? (
                  <p className="text-base-content/70 text-center py-12">
                    No reviews submitted yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {myReviews.map((review) => (
                      <div
                        key={review.promptId}
                        className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {review.promptTitle}
                          </h4>
                          <p className="text-sm text-base-content/70">
                            Rating: {review.review.rating}/5
                          </p>
                          <p className="text-sm text-base-content/70 mt-1">
                            {review.review.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

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
                            {session?.user?.name?.charAt(0).toUpperCase() ||
                              "U"}{" "}
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
                    </div>
                    {userProfile.subscription === "free" && (
                      <div className="alert alert-info mt-4">
                        <div className="flex gap-4 items-center justify-between">
                          <span>Upgrade to Premium for unlimited access</span>
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
  );
}
