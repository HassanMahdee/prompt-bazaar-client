"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaChartBar,
  FaSignOutAlt,
  FaBookmark,
  FaTrash,
} from "react-icons/fa";
import DashboardSidebar from "@/components/shared/dashboard-sidebar/DashboardSidebar";
import { get, del } from "@/lib/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import AddPrompt from "@/components/addPrompt/addPrompt";

export default function CreatorDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("analytics");
  const [analytics, setAnalytics] = useState(null);
  const [myPrompts, setMyPrompts] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(false);
  const hasLoadedInitial = useRef(false);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching analytics for user:", session?.user?.email);
      const data = await get(
        `/analytics/creator-summary/${session?.user?.email}`,
      );
      console.log("Analytics data:", data);
      setAnalytics(data.data);
    } catch (err) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, [session]);

  const fetchMyPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get(`/prompts/creator/${session?.user?.email}`);
      setMyPrompts(data.data || []);
    } catch (err) {
      toast.error("Failed to load prompts");
    } finally {
      setLoading(false);
    }
  }, [session]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "analytics") {
      fetchAnalytics();
    } else if (tab === "prompts" && myPrompts.length === 0) {
      fetchMyPrompts();
    }
  };

  useEffect(() => {
    if (session && !hasLoadedInitial.current) {
      hasLoadedInitial.current = true;
      const loadInitialData = async () => {
        try {
          const data = await get(
            `/analytics/creator-summary/${session.user.email}`,
          );
          setAnalytics(data.data);
        } catch (err) {
          toast.error("Failed to load analytics");
        }
      };
      loadInitialData();
    }
  }, [session]);

  const handleDeletePrompt = async (promptId) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;

    try {
      await del(`/prompts/${promptId}`);
      toast.success("Prompt deleted successfully");
      fetchMyPrompts();
    } catch (err) {
      toast.error("Failed to delete prompt");
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
        dashboardType="creator"
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-base-200 p-8">
        {activeTab === "analytics" && (
          <>
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Analytics</h2>
                {analytics ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <div className="stats shadow bg-base-100">
                        <div className="stat">
                          <div className="stat-title">Total Prompts</div>
                          <div className="stat-value text-primary">
                            {analytics.totalPrompts || 0}
                          </div>
                          <div className="stat-desc">Published</div>
                        </div>
                      </div>
                      <div className="stats shadow bg-base-100">
                        <div className="stat">
                          <div className="stat-title">Total Copies</div>
                          <div className="stat-value text-secondary">
                            {analytics.totalCopies || 0}
                          </div>
                          <div className="stat-desc">All time</div>
                        </div>
                      </div>
                      <div className="stats shadow bg-base-100">
                        <div className="stat">
                          <div className="stat-title">Avg Rating</div>
                          <div className="stat-value text-accent">
                            {analytics.averageRating?.toFixed(1) || 0}
                          </div>
                          <div className="stat-desc">Out of 5</div>
                        </div>
                      </div>
                      <div className="stats shadow bg-base-100">
                        <div className="stat">
                          <div className="stat-title">Total Reviews</div>
                          <div className="stat-value">
                            {analytics.totalReviews || 0}
                          </div>
                          <div className="stat-desc">Received</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                          <h3 className="card-title text-xl mb-4">
                            Prompt Performance
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.promptPerformance || []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="title" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar
                                dataKey="copies"
                                fill="#6366f1"
                                name="Copies"
                              />
                              <Bar
                                dataKey="rating"
                                fill="#ec4899"
                                name="Rating"
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                          <h3 className="card-title text-xl mb-4">
                            Monthly Growth
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={analytics.monthlyGrowth || []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="copies"
                                stroke="#6366f1"
                                name="Copies"
                              />
                              <Line
                                type="monotone"
                                dataKey="reviews"
                                stroke="#ec4899"
                                name="Reviews"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "create-prompt" && (
          <>
            <div className="card bg-base-100 shadow-lg mb-6">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title text-2xl">Creator Dashboard</h2>
                </div>
                <p className="text-base-content/70 mb-6">
                  Create a new prompt to share with the community.
                </p>
                <div className="alert alert-info mb-6">
                  <span>
                    All newly submitted prompts are automatically marked as
                    pending and remain hidden from the marketplace until
                    reviewed by an admin.
                  </span>
                </div>
                <AddPrompt />
              </div>
            </div>
          </>
        )}

        {activeTab === "my-prompts" && (
          <>
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title text-2xl">My Prompts</h2>
                  <Link
                    href="/dashboard/create-prompt"
                    className="btn btn-primary"
                  >
                    <FaPlus className="mr-2" />
                    Create New Prompt
                  </Link>
                </div>
                <p className="text-base-content/70">
                  Manage your prompts and track their performance.
                </p>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : myPrompts.length === 0 ? (
                  <p className="text-base-content/70 text-center py-12">
                    No prompts created yet
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Prompt Title</th>
                          <th>Category</th>
                          <th>Copies</th>
                          <th>Rating</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myPrompts.map((prompt) => (
                          <tr key={prompt._id}>
                            <td>{prompt.title}</td>
                            <td>{prompt.category}</td>
                            <td>{prompt.copyCount || 0}</td>
                            <td>{prompt.averageRating?.toFixed(1) || 0}</td>
                            <td>
                              <span
                                className={`badge ${prompt.status === "published" ? "badge-success" : "badge-warning"}`}
                              >
                                {prompt.status}
                              </span>
                            </td>
                            <td>
                              <div className="flex gap-2">
                                <Link
                                  href={`/dashboard/edit-prompt/${prompt._id}`}
                                  className="btn btn-sm btn-ghost"
                                >
                                  <FaEdit />
                                </Link>
                                <button
                                  onClick={() => handleDeletePrompt(prompt._id)}
                                  className="btn btn-sm btn-error btn-ghost"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
