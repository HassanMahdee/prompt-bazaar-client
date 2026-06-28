"use client";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import { post } from "../../lib/api";

export default function AddReview({ promptId, setPrompt }) {
  const { data: session } = useSession();
  const user = session?.user;
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const reviewData = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        rating: parseInt(rating),
        comment: comment,
      };

      const res = await post(`/prompts/${promptId}/reviews`, reviewData);
      console.log(res.data);
      if (res.data) {
        setMessage("Review submitted successfully!");
        setPrompt(res.data);
        setComment("");
        setRating(5);
      } else {
        setMessage("Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error submitting review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="textarea textarea-bordered w-full"
        placeholder="Write a review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      ></textarea>
      <div className="mt-2 flex items-center">
        <select
          className="select select-bordered"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        >
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
        <button
          type="submit"
          className="btn btn-primary ml-2"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </form>
  );
}
