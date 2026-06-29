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
      setAdminStats(data);
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
      const data = await get("/prompts/all-prompts-admin");
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
          setAdminStats(data);
        } else if (activeTab === "users") {
          const data = await get("/user");
          setUsers(data.data || []);
        } else if (activeTab === "all-prompts") {
          const data = await get("/prompts/all-prompts-admin");
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
      await patch(`/prompts/${promptId}/status`, { status: "approved" });
      toast.success("Prompt approved successfully");
      fetchAllPrompts();
    } catch (err) {
      toast.error("Failed to approve prompt");
    }
  };

  const handleRejectPrompt = async (promptId) => {
    try {
      await patch(`/prompts/${promptId}/status`, {
        status: "rejected",
      });
      toast.success("Prompt rejected successfully");
      fetchAllPrompts();
    } catch (err) {
      toast.error("Failed to reject prompt");
    }
  };

  const handleFeaturePrompt = async (promptId) => {
    try {
      await patch(`/prompts/${promptId}/featured`, { featured: true });
      toast.success("Prompt featured successfully");
      fetchAllPrompts();
    } catch (err) {
      toast.error("Failed to feature prompt");
    }
  };

  const handleUnfeaturePrompt = async (promptId) => {
    try {
      await patch(`/prompts/${promptId}/featured`, { featured: false });
      toast.success("Prompt unfeatured successfully");
      fetchAllPrompts();
    } catch (err) {
      toast.error("Failed to unfeature prompt");
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      console.log("Dismissing report:", reportId);
      await del(`/reports/${reportId}`);
      toast.success("Report dismissed successfully");
      fetchReports();
    } catch (err) {
      toast.error("Failed to dismiss report");
    }
  };

  const handleRemoveReportedPrompt = async (promptId) => {
    try {
      await del(`/prompts/${promptId}`);
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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
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
                      <div className="stat-desc">All prompts</div>
                    </div>
                  </div>
                  <div className="stats shadow bg-base-100">
                    <div className="stat">
                      <div className="stat-title">Approved</div>
                      <div className="stat-value text-success">
                        {adminStats.approvedPrompts || 0}
                      </div>
                      <div className="stat-desc">Approved prompts</div>
                    </div>
                  </div>
                  <div className="stats shadow bg-base-100">
                    <div className="stat">
                      <div className="stat-title">Pending</div>
                      <div className="stat-value text-warning">
                        {adminStats.pendingPrompts || 0}
                      </div>
                      <div className="stat-desc">Pending prompts</div>
                    </div>
                  </div>
                  <div className="stats shadow bg-base-100">
                    <div className="stat">
                      <div className="stat-title">Rejected</div>
                      <div className="stat-value text-error">
                        {adminStats.rejectedPrompts || 0}
                      </div>
                      <div className="stat-desc">Rejected prompts</div>
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
                      <div className="stat-title">Total Bookmarks</div>
                      <div className="stat-value text-info">
                        {adminStats.totalBookmarks || 0}
                      </div>
                      <div className="stat-desc">User bookmarks</div>
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
                  <div className="stats shadow bg-base-100">
                    <div className="stat">
                      <div className="stat-title">Total Reports</div>
                      <div className="stat-value text-error">
                        {adminStats.totalReports || 0}
                      </div>
                      <div className="stat-desc">Reported content</div>
                    </div>
                  </div>
                  <div className="stats shadow bg-base-100">
                    <div className="stat">
                      <div className="stat-title">Total Payments</div>
                      <div className="stat-value text-success">
                        {adminStats.totalPayments || 0}
                      </div>
                      <div className="stat-desc">Completed payments</div>
                    </div>
                  </div>
                  <div className="stats shadow bg-base-100">
                    <div className="stat">
                      <div className="stat-title">Total Revenue</div>
                      <div className="stat-value text-success">
                        ${adminStats.totalRevenue || 0}
                      </div>
                      <div className="stat-desc">Platform revenue</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title text-xl mb-4">User Metrics</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={[
                            {
                              name: "Total Users",
                              value: adminStats.totalUsers || 0,
                            },
                            {
                              name: "Reviews",
                              value: adminStats.totalReviews || 0,
                            },
                            {
                              name: "Bookmarks",
                              value: adminStats.totalBookmarks || 0,
                            },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#6366f1" name="Count" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title text-xl mb-4">
                        Revenue & Payments
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={[
                            {
                              name: "Revenue",
                              value: adminStats.totalRevenue || 0,
                            },
                            {
                              name: "Payments",
                              value: adminStats.totalPayments || 0,
                            },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="value"
                            fill="#10b981"
                            name="Amount ($)"
                          />
                        </BarChart>
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
                                        handleRejectPrompt(prompt._id);
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
                              className={`badge ${report.status === "pending" ? "badge-warning" : "badge-success"}`}
                            >
                              {report.status}
                            </span>
                          </div>
                          <p className="text-sm mb-3">{report.description}</p>
                          {report.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDismissReport(report._id)}
                                className="btn btn-sm btn-outline"
                              >
                                Dismiss
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveReportedPrompt(report.promptId)
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
