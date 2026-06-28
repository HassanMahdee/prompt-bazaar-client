"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaEdit, FaSave, FaCrown } from "react-icons/fa";
import { get, patch } from "@/lib/api";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const data = await get(`/user/profile/${session?.user?.email}`);
      setUserProfile(data.data);
      setFormData({
        name: data.data.name || "",
        email: data.data.email || "",
        bio: data.data.bio || "",
      });
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      const loadProfile = async () => {
        setLoading(true);
        try {
          const data = await get(`/user/profile/${session?.user?.email}`);
          setUserProfile(data.data);
          setFormData({
            name: data.data.name || "",
            email: data.data.email || "",
            bio: data.data.bio || "",
          });
        } catch (err) {
          toast.error("Failed to load profile");
        } finally {
          setLoading(false);
        }
      };
      loadProfile();
    }
  }, [session]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await patch(`/user/${session?.user?.email}`, formData);
      toast.success("Profile updated successfully");
      setEditing(false);
      fetchUserProfile();
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      bio: userProfile?.bio || "",
    });
  };

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container-xy">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h1 className="card-title text-3xl">Profile</h1>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-outline btn-sm"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {loading && !userProfile ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-8">
                  <div className="avatar placeholder mb-4">
                    <div className="bg-neutral text-neutral-content rounded-full w-32">
                      <span className="text-4xl">
                        {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{userProfile?.name}</h2>
                    {userProfile?.subscription === "premium" && (
                      <FaCrown
                        className="text-yellow-500 text-xl"
                        title="Premium User"
                      />
                    )}
                  </div>
                  <p className="text-base-content/70">{userProfile?.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`badge ${userProfile?.role === "admin" ? "badge-error" : userProfile?.role === "creator" ? "badge-secondary" : "badge-primary"}`}
                    >
                      {userProfile?.role}
                    </span>
                    <span
                      className={`badge ${userProfile?.subscription === "premium" ? "badge-warning" : "badge-neutral"}`}
                    >
                      {userProfile?.subscription}
                    </span>
                  </div>
                </div>

                <div className="divider"></div>

                {editing ? (
                  <div className="space-y-4">
                    <div className="form-field">
                      <label className="label">
                        <span className="label-text font-semibold">Name</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label className="label">
                        <span className="label-text font-semibold">Email</span>
                      </label>
                      <input
                        type="email"
                        className="input input-bordered w-full"
                        value={formData.email}
                        disabled
                      />
                      <span className="text-xs text-base-content/50">
                        Email cannot be changed
                      </span>
                    </div>

                    <div className="form-field">
                      <label className="label">
                        <span className="label-text font-semibold">Bio</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full"
                        rows={4}
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself..."
                      ></textarea>
                    </div>

                    <div className="flex gap-2 mt-6">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="btn btn-primary flex-1"
                      >
                        {loading ? (
                          <span className="loading loading-spinner"></span>
                        ) : (
                          <>
                            <FaSave className="mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <FaUser className="text-xl mt-1 text-base-content/50" />
                      <div>
                        <p className="font-semibold">Name</p>
                        <p className="text-base-content/70">
                          {userProfile?.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <FaEnvelope className="text-xl mt-1 text-base-content/50" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-base-content/70">
                          {userProfile?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="text-xl mt-1 text-base-content/50">
                        📝
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">Bio</p>
                        <p className="text-base-content/70 whitespace-pre-wrap">
                          {userProfile?.bio || "No bio added yet"}
                        </p>
                      </div>
                    </div>

                    <div className="divider"></div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Role</div>
                        <div className="stat-value text-lg">
                          {userProfile?.role}
                        </div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Subscription</div>
                        <div className="stat-value text-lg">
                          {userProfile?.subscription}
                        </div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Total Prompts</div>
                        <div className="stat-value text-lg">
                          {userProfile?.promptCount || 0}
                        </div>
                      </div>
                      <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Member Since</div>
                        <div className="stat-value text-lg">
                          {new Date(
                            userProfile?.createdAt,
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {userProfile?.subscription === "free" && (
                      <div className="alert alert-info mt-4">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <FaCrown className="text-yellow-500" />
                            <span>Upgrade to Premium for unlimited access</span>
                          </div>
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
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
