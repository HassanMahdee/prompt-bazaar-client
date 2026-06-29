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
import DashboardSidebar from "@/components/shared/dashboard-sidebar/DashboardSidebar";
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
  const [activeTab, setActiveTab] = useState("analytics");
  const [adminStats, setAdminStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingPrompts, setPendingPrompts] = useState([]);
  const [allPrompts, setAllPrompts] = useState([]);
  const [payments, setPayments] = useState([]);
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

  const fetchAllPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get("/prompts");
      setAllPrompts(data.data || []);
    } catch (err) {
      toast.error("Failed to load prompts");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get("/payments");
      setPayments(data.data || []);
    } catch (err) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) return;

    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === "analytics") {
          const data = await get("/analytics/admin-summary");
          setAdminStats(data.data);
        } else if (activeTab === "users") {
          const data = await get("/user");
          setUsers(data || []);
        } else if (activeTab === "all-prompts") {
          const data = await get("/prompts");
          setAllPrompts(data.data || []);
        } else if (activeTab === "payments") {
          const data = await get("/payments");
          setPayments(data.data || []);
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

  const handleRejectPrompt = async (promptId, feedback) => {
    try {
      await patch(`/prompts/${promptId}/status`, {
        status: "rejected",
        feedback,
      });
      toast.success("Prompt rejected successfully");
      fetchAllPrompts();
    } catch (err) {
      toast.error("Failed to reject prompt");
    }
  };

  const handleFeaturePrompt = async (promptId) => {
    try {
      await patch(`/prompts/${promptId}/feature`, { featured: true });
      toast.success("Prompt featured successfully");
      fetchAllPrompts();
    } catch (err) {
      toast.error("Failed to feature prompt");
    }
  };

  const handleUnfeaturePrompt = async (promptId) => {
    try {
      await patch(`/prompts/${promptId}/feature`, { featured: false });
      toast.success("Prompt unfeatured successfully");
      fetchAllPrompts();
    } catch (err) {
      toast.error("Failed to unfeature prompt");
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

  const handleDeletePrompt = async (promptId) => {
    if (!confirm("Are you sure you want to delete this prompt?")) return;
    try {
      await del(`/prompts/${promptId}`);
      toast.success("Prompt deleted successfully");
      fetchAllPrompts();
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
        onTabChange={setActiveTab}
        dashboardType="admin"
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-base-200 p-8">
        {activeTab === "analytics" && (
          <>
            <div className="card bg-base-100 shadow-lg mb-6">
              <div className="card-body">
                <h2 className="card-title text-2xl">Analytics Dashboard</h2>
                <p className="text-base-content/70">
                  Overview of platform statistics and performance metrics.
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
                      <div className="stat-desc">Registered users</div>
                    </div>
                  </div>
                  <div className="stats shadow bg-base-100">
                    <div className="stat">
                      <div className="stat-title">Total Prompts</div>
                      <div className="stat-value text-secondary">
                        {adminStats.totalPrompts || 0}
                      </div>
                      <div className="stat-desc">Published prompts</div>
                    </div>
                  </div>
                  <div className="stats shadow bg-base-100">
                    <div className="stat">
                      <div className="stat-title">Total Reviews</div>
                      <div className="stat-value text-accent">
                        {adminStats.totalReviews || 0}
                      </div>
                      <div className="stat-desc">User reviews</div>
                    </div>
                  </div>
                  <div className="stats shadow bg-base-100">
                    <div className="stat">
                      <div className="stat-title">Total Copies</div>
                      <div className="stat-value">
                        {adminStats.totalCopies || 0}
                      </div>
                      <div className="stat-desc">Prompt copies</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title text-xl mb-4">User Growth</h3>
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
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title text-xl mb-4">Prompt Growth</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={adminStats.growthData || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
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
                </div>

                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <h3 className="card-title text-xl mb-4">
                      Reviews & Copies Overview
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={adminStats.growthData || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="reviews" fill="#10b981" name="Reviews" />
                        <Bar dataKey="copies" fill="#f59e0b" name="Copies" />
                      </BarChart>
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
                <h2 className="card-title text-2xl mb-4">User Management</h2>
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
                                  handleUpdateUserRole(user._id, e.target.value)
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

        {activeTab === "all-prompts" && (
          <>
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">All Prompts</h2>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : allPrompts.length === 0 ? (
                  <p className="text-base-content/70 text-center py-12">
                    No prompts found
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Prompt Title</th>
                          <th>Creator</th>
                          <th>Category</th>
                          <th>Status</th>
                          <th>Featured</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allPrompts.map((prompt) => (
                          <tr key={prompt._id}>
                            <td>{prompt.title}</td>
                            <td>{prompt.creatorEmail}</td>
                            <td>{prompt.category}</td>
                            <td>
                              <span
                                className={`badge ${prompt.status === "published" ? "badge-success" : prompt.status === "rejected" ? "badge-error" : "badge-warning"}`}
                              >
                                {prompt.status}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${prompt.featured ? "badge-primary" : "badge-ghost"}`}
                              >
                                {prompt.featured ? "Yes" : "No"}
                              </span>
                            </td>
                            <td>
                              <div className="flex gap-2">
                                {prompt.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleApprovePrompt(prompt._id)
                                      }
                                      className="btn btn-sm btn-success btn-ghost"
                                    >
                                      <FaCheck />
                                    </button>
                                    <button
                                      onClick={() => {
                                        const feedback = prompt(
                                          "Enter rejection feedback:",
                                        );
                                        if (feedback)
                                          handleRejectPrompt(
                                            prompt._id,
                                            feedback,
                                          );
                                      }}
                                      className="btn btn-sm btn-error btn-ghost"
                                    >
                                      <FaTimes />
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() =>
                                    prompt.featured
                                      ? handleUnfeaturePrompt(prompt._id)
                                      : handleFeaturePrompt(prompt._id)
                                  }
                                  className="btn btn-sm btn-warning btn-ghost"
                                >
                                  {prompt.featured ? "Unfeature" : "Feature"}
                                </button>
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

        {activeTab === "payments" && (
          <>
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">All Payments</h2>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : payments.length === 0 ? (
                  <p className="text-base-content/70 text-center py-12">
                    No payments found
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment._id}>
                            <td>{payment.userEmail}</td>
                            <td>${payment.amount}</td>
                            <td>
                              <span
                                className={`badge ${payment.status === "completed" ? "badge-success" : "badge-warning"}`}
                              >
                                {payment.status}
                              </span>
                            </td>
                            <td>
                              {new Date(payment.createdAt).toLocaleDateString()}
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
                              <h4 className="font-semibold">{report.reason}</h4>
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
                          <p className="text-sm mb-3">{report.description}</p>
                          {report.status === "open" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDismissReport(report._id)}
                                className="btn btn-sm btn-outline"
                              >
                                Dismiss
                              </button>
                              <button
                                onClick={() => handleWarnCreator(report._id)}
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
  );
}
