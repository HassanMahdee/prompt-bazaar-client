import Link from "next/link";

import { FaCopy, FaEye, FaStar } from "react-icons/fa";

export default function PromptCard({ prompt }) {
  const {
    title,
    category,
    aiTool,
    difficultyLevel,
    copyCount,
    averageRating,
    creatorId,
    _id,
  } = prompt;
  return (
    <div className="card card-border bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
      <div className="card-body flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <h2 className="card-title text-lg font-semibold line-clamp-2">
            {title}
          </h2>
          <div className="badge badge-primary p-3">{aiTool}</div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="badge badge-secondary badge-sm">{category}</span>
          <span className="badge badge-accent badge-sm">{difficultyLevel}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-base-content/70 mb-4">
          <div className="flex items-center gap-1">
            <FaCopy />
            <span>{copyCount || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span>{averageRating || 0}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-8">
              <span className="text-xs">
                {creatorId?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <span className="text-sm font-medium">{creatorId}</span>
        </div>

        <div className="card-actions justify-end">
          <Link href={`/prompts/${_id}`} className="btn btn-primary btn-sm">
            <FaEye className="mr-2" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
