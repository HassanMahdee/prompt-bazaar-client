"use client";
import { useState } from "react";
import { patch } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function UpdatePromptModal({
  prompt,
  onClose,
  setMyPrompts,
  fetchMyPrompts,
}) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: prompt?.title || "",
    description: prompt?.description || "",
    content: prompt?.content || "",
    category: prompt?.category || "",
    aiTool: prompt?.aiTool || "",
    tags: prompt?.tags ? prompt.tags.join(", ") : "",
    difficultyLevel: prompt?.difficultyLevel || "Beginner",
    thumbnail: prompt?.thumbnail || "",
    visibility: prompt?.visibility || "public",
    featured: prompt?.featured || false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPrompt = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        userEmail: session?.user?.email || "",
      };

      const res = await patch(`/prompts/${prompt._id}`, updatedPrompt);
      if (res) {
        toast.success("Prompt Updated Successfully!");
        onClose();
        setMyPrompts(fetchMyPrompts());
      }
    } catch (err) {
      toast.error("Failed to update prompt");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center bg-opacity-40">
      <div className="p-6 max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg border border-base-300 w-full">
        <h2 className="text-2xl font-bold mb-5 text-center">Update Prompt</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-field">
            <label>Prompt Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-field">
            <label>Prompt Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="textarea textarea-bordered w-full"
            ></textarea>
          </div>

          <div className="form-field">
            <label>Prompt Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              className="textarea textarea-bordered w-full"
            ></textarea>
          </div>

          <div className="form-field">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-field">
            <label>AI Tool</label>
            <input
              type="text"
              name="aiTool"
              value={formData.aiTool}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-field">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-field">
            <label>Difficulty Level</label>
            <select
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Pro">Pro</option>
            </select>
          </div>

          <div className="form-field">
            <label>Thumbnail Image URL</label>
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-field">
            <label>Visibility</label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update Prompt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
