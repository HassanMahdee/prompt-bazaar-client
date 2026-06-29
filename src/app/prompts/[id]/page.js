"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FaCopy,
  FaBookmark,
  FaRegBookmark,
  FaFlag,
  FaStar,
} from "react-icons/fa";
import { get, post, patch, del } from "@/lib/api";
import AddReview from "@/components/addReview/addReview";

export default function PromptDetailPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [promptId, setPromptId] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  useEffect(() => {
    params.then?.((p) => setPromptId(p.id));
  }, [params]);

  useEffect(() => {
    if (!promptId || !session) return;

    const loadPrompt = async () => {
      try {
        const data = await get(`/prompts/${promptId}`);
        setPrompt(data.data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load prompt");
      } finally {
        setLoading(false);
      }
    };

    const loadBookmarkStatus = async () => {
      try {
        const data = await get(`/bookmarks/check/${promptId}/${session?.user?.email}`);
        setIsBookmarked(data.isBookmarked);
      } catch (err) {
        console.error("Bookmark check failed:", err);
      }
    };

    loadPrompt();
    loadBookmarkStatus();
  }, [session, promptId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      await patch(`/prompts/${promptId}/copy`);
      toast.success("Prompt copied to clipboard");
      setPrompt((prev) => ({ ...prev, copyCount: (prev.copyCount || 0) + 1 }));
    } catch (err) {
      toast.error("Failed to copy prompt");
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await del(`/bookmarks/${promptId}`, {
          userEmail: session?.user?.email,
        });
        setIsBookmarked(false);
        toast.success("Bookmark removed");
      } else {
        await post("/bookmarks", { promptId, userEmail: session?.user?.email });
        setIsBookmarked(true);
        toast.success("Prompt bookmarked");
      }
    } catch (err) {
      toast.error(err.message || "Failed to update bookmark");
    }
  };

  const handleReport = async () => {
    try {
      await post("/reports", {
        promptId,
        reason: reportReason,
        description: reportDescription,
        userEmail: session?.user?.email,
      });
      toast.success("Report submitted successfully");
      setShowReportModal(false);
      setReportReason("");
      setReportDescription("");
    } catch (err) {
      toast.error(err.message || "Failed to submit report");
    }
  };

  const isPremiumLocked =
    prompt?.visibility === "private" &&
    session?.user?.subscription !== "premium";

  if (loading) {
    return (
      <div className="container-xy">
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xy">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="container-xy">
        <div className="alert alert-warning">
          <span>Prompt not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xy">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-start mb-4">
              <h1 className="card-title text-3xl">{prompt.title}</h1>
              {isPremiumLocked && (
                <div className="badge badge-warning">Premium Only</div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge badge-primary">{prompt.aiTool}</span>
              <span className="badge badge-secondary">{prompt.category}</span>
              <span className="badge badge-accent">
                {prompt.difficultyLevel}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-semibold">Creator:</span>
                <span>{prompt.creatorId}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">Rating:</span>
                <span>{prompt.averageRating || 0}/5</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">Copies:</span>
                <span>{prompt.copyCount || 0}</span>
              </div>
            </div>

            <div className="divider"></div>

            <h2 className="text-xl font-semibold mb-3">Prompt Content</h2>
            <div
              className={`bg-base-200 p-4 rounded-lg mb-6 ${isPremiumLocked ? "blur-sm" : ""}`}
            >
              <p className="whitespace-pre-wrap">
                {isPremiumLocked
                  ? "This is a premium prompt. Upgrade to view the full content."
                  : prompt.content}
              </p>
            </div>

            {isPremiumLocked && (
              <div className="alert alert-info mb-6">
                <div className="flex items-center justify-between w-full">
                  <span>
                    This is a premium prompt. Upgrade to access full content.
                  </span>
                  <button
                    onClick={() => router.push("/payment")}
                    className="btn btn-primary btn-sm"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            )}

            <div className="divider"></div>

            <h2 className="text-xl font-semibold mb-3">Tags</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {prompt.tags?.map((tag) => (
                <span key={tag} className="badge badge-outline">
                  {tag}
                </span>
              ))}
            </div>

            <div className="card-actions justify-end gap-2">
              <button
                onClick={handleCopy}
                disabled={isPremiumLocked}
                className="btn btn-primary"
              >
                <FaCopy className="mr-2" />
                Copy Prompt
              </button>
              <button onClick={handleBookmark} className="btn btn-outline">
                {isBookmarked ? (
                  <FaBookmark className="mr-2" />
                ) : (
                  <FaRegBookmark className="mr-2" />
                )}
                {isBookmarked ? "Saved" : "Save to Favorites"}
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="btn btn-ghost"
              >
                <FaFlag className="mr-2" />
                Report
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Reviews</h2>
          <div className="space-y-4">
            {prompt.reviews?.length > 0 ? (
              prompt.reviews.map((review, idx) => (
                <div key={idx} className="card bg-base-100 shadow">
                  <div className="card-body">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <span>
                            {review.userName?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold">{review.userName}</h3>
                        <div className="flex text-yellow-500 text-sm">
                          {"★".repeat(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-base-content/70">No reviews yet</p>
            )}
          </div>
          <AddReview promptId={promptId} setPrompt={setPrompt} />
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Report Prompt</h3>
            <div className="form-field">
              <label className="label">Reason</label>
              <select
                className="select select-bordered w-full"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                <option value="Inappropriate Content">
                  Inappropriate Content
                </option>
                <option value="Spam">Spam</option>
                <option value="Copyright Violation">Copyright Violation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-field">
              <label className="label">Description (Optional)</label>
              <textarea
                className="textarea textarea-bordered"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Additional details..."
              ></textarea>
            </div>
            <div className="modal-action">
              <button onClick={() => setShowReportModal(false)} className="btn">
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportReason}
                className="btn btn-primary"
              >
                Submit Report
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowReportModal(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}
