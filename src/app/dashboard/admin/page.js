"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaShieldAlt,
  FaChartBar,
  FaSignOutAlt,
  FaClipboardList,
  FaTrash,
  FaCheck,
  FaTimes,
  FaFlag,
} from "react-icons/fa";
import { get, patch, del, post } from "@/lib/api";
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

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminStats, setAdminStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingPrompts, setPendingPrompts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get("/analytics/admin-summary");
      setAdminStats(data.data);
    } catch (err) {
      toast.error("Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get("/user");
      setUsers(data.data || []);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get("/prompts?status=pending");
      setPendingPrompts(data.data || []);
    } catch (err) {
      toast.error("Failed to load pending prompts");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get("/reports");
      setReports(data.data || []);
    } catch (err) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) return;

    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === "dashboard") {
          const data = await get("/analytics/admin-summary");
          setAdminStats(data.data);
        } else if (activeTab === "users") {
          const data = await get("/user");
          setUsers(data.data || []);
        } else if (activeTab === "moderation") {
          const data = await get("/prompts?status=pending");
          setPendingPrompts(data.data || []);
        } else if (activeTab === "reports") {
          const data = await get("/reports");
          setReports(data.data || []);
        }
      } catch (err) {
        toast.error(`Failed to load ${activeTab}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session, activeTab]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await patch(`/user/${userId}/role`, { role: newRole });
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await del(`/user/${userId}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleApprovePrompt = async (promptId) => {
    try {
      await patch(`/prompts/${promptId}/status`, { status: "published" });
      toast.success("Prompt approved successfully");
      fetchPendingPrompts();
    } catch (err) {
      toast.error("Failed to approve prompt");
    }
  };

  const handleRejectPrompt = async (promptId) => {
    try {
      await patch(`/prompts/${promptId}/status`, { status: "rejected" });
      toast.success("Prompt rejected successfully");
      fetchPendingPrompts();
    } catch (err) {
      toast.error("Failed to reject prompt");
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      await patch(`/reports/${reportId}/dismiss`);
      toast.success("Report dismissed successfully");
      fetchReports();
    } catch (err) {
      toast.error("Failed to dismiss report");
    }
  };

  const handleWarnCreator = async (reportId) => {
    try {
      await post(`/reports/${reportId}/warn`);
      toast.success("Warning sent to creator successfully");
      fetchReports();
    } catch (err) {
      toast.error("Failed to send warning");
    }
  };

  const handleRemoveReportedPrompt = async (reportId) => {
    if (!confirm("Are you sure you want to remove this prompt?")) return;

    try {
      await del(`/reports/${reportId}/prompt`);
      toast.success("Prompt removed successfully");
      fetchReports();
    } catch (err) {
      toast.error("Failed to remove prompt");
    }
  };

  if (!session) {
    return null;
  }

  return (
    <div className="container-xy">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex flex-col items-center mb-6">
                  <div className="avatar placeholder mb-3">
                    <div className="bg-neutral text-neutral-content rounded-full w-20">
                      <span className="text-2xl">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold">{session.user.name}</h2>
                  <p className="text-sm text-base-content/70">
                    {session.user.email}
                  </p>
                  <div className="badge badge-error mt-2">Admin</div>
                </div>

                <div className="divider"></div>

                <ul className="menu menu-vertical bg-base-200 rounded-box">
                  <li>
                    <a
                      className={activeTab === "dashboard" ? "active" : ""}
                      onClick={() => setActiveTab("dashboard")}
                    >
                      <FaChartBar className="mr-2" />
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      className={activeTab === "users" ? "active" : ""}
                      onClick={() => setActiveTab("users")}
                    >
                      <FaUsers className="mr-2" />
                      User Management
                    </a>
                  </li>
                  <li>
                    <a
                      className={activeTab === "moderation" ? "active" : ""}
                      onClick={() => setActiveTab("moderation")}
                    >
                      <FaClipboardList className="mr-2" />
                      Prompt Moderation
                    </a>
                  </li>
                  <li>
                    <a
                      className={activeTab === "reports" ? "active" : ""}
                      onClick={() => setActiveTab("reports")}
                    >
                      <FaFlag className="mr-2" />
                      Reports
                    </a>
                  </li>
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
            {activeTab === "dashboard" && (
              <>
                <div className="card bg-base-100 shadow-lg mb-6">
                  <div className="card-body">
                    <h2 className="card-title text-2xl">Admin Dashboard</h2>
                    <p className="text-base-content/70">
                      Overview of platform statistics and administrative
                      controls.
                    </p>
                  </div>
                </div>

                {adminStats ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                      <div className="stats shadow bg-base-100">
                        <div className="stat">
                          <div className="stat-title">Total Users</div>
                          <div className="stat-value text-primary">
                            {adminStats.totalUsers || 0}
                          </div>
                          <div className="stat-desc">Registered</div>
                        </div>
                      </div>
                      <div className="stats shadow bg-base-100">
                        <div className="stat">
                          <div className="stat-title">Total Prompts</div>
                          <div className="stat-value text-secondary">
                            {adminStats.totalPrompts || 0}
                          </div>
                          <div className="stat-desc">Published</div>
                        </div>
                      </div>
                      <div className="stats shadow bg-base-100">
                        <div className="stat">
                          <div className="stat-title">Pending Review</div>
                          <div className="stat-value text-accent">
                            {adminStats.pendingPrompts || 0}
                          </div>
                          <div className="stat-desc">Need approval</div>
                        </div>
                      </div>
                      <div className="stats shadow bg-base-100">
                        <div className="stat">
                          <div className="stat-title">Total Reports</div>
                          <div className="stat-value">
                            {adminStats.totalReports || 0}
                          </div>
                          <div className="stat-desc">Open reports</div>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-base-100 shadow-lg mb-6">
                      <div className="card-body">
                        <h3 className="card-title text-xl mb-4">
                          Platform Growth
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={adminStats.growthData || []}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="users"
                              stroke="#6366f1"
                              name="Users"
                            />
                            <Line
                              type="monotone"
                              dataKey="prompts"
                              stroke="#ec4899"
                              name="Prompts"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                )}
              </>
            )}

            {activeTab === "users" && (
              <>
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">
                      User Management
                    </h2>
                    {loading ? (
                      <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                      </div>
                    ) : users.length === 0 ? (
                      <p className="text-base-content/70 text-center py-12">
                        No users found
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Subscription</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((user) => (
                              <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                  <select
                                    className="select select-xs select-bordered"
                                    value={user.role}
                                    onChange={(e) =>
                                      handleUpdateUserRole(
                                        user._id,
                                        e.target.value,
                                      )
                                    }
                                  >
                                    <option value="user">User</option>
                                    <option value="creator">Creator</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                </td>
                                <td>{user.subscription}</td>
                                <td>
                                  <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="btn btn-sm btn-error btn-ghost"
                                  >
                                    <FaTrash />
                                  </button>
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

            {activeTab === "moderation" && (
              <>
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">
                      Prompt Moderation
                    </h2>
                    {loading ? (
                      <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                      </div>
                    ) : pendingPrompts.length === 0 ? (
                      <p className="text-base-content/70 text-center py-12">
                        No pending prompts
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {pendingPrompts.map((prompt) => (
                          <div
                            key={prompt._id}
                            className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
                          >
                            <div>
                              <h4 className="font-semibold">{prompt.title}</h4>
                              <p className="text-sm text-base-content/70">
                                By: {prompt.creatorId}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprovePrompt(prompt._id)}
                                className="btn btn-sm btn-success"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleRejectPrompt(prompt._id)}
                                className="btn btn-sm btn-error"
                              >
                                <FaTimes />
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

            {activeTab === "reports" && (
              <>
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-2xl mb-4">Reports</h2>
                    {loading ? (
                      <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                      </div>
                    ) : reports.length === 0 ? (
                      <p className="text-base-content/70 text-center py-12">
                        No reports found
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {reports.map((report) => (
                          <div key={report._id} className="card bg-base-200">
                            <div className="card-body p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h4 className="font-semibold">
                                    {report.reason}
                                  </h4>
                                  <p className="text-sm text-base-content/70">
                                    By: {report.userEmail}
                                  </p>
                                </div>
                                <span
                                  className={`badge ${report.status === "open" ? "badge-warning" : "badge-success"}`}
                                >
                                  {report.status}
                                </span>
                              </div>
                              <p className="text-sm mb-3">
                                {report.description}
                              </p>
                              {report.status === "open" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleDismissReport(report._id)
                                    }
                                    className="btn btn-sm btn-outline"
                                  >
                                    Dismiss
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleWarnCreator(report._id)
                                    }
                                    className="btn btn-sm btn-warning"
                                  >
                                    Warn Creator
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleRemoveReportedPrompt(report._id)
                                    }
                                    className="btn btn-sm btn-error"
                                  >
                                    Remove Prompt
                                  </button>
                                </div>
                              )}
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
