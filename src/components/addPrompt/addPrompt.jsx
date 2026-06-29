"use client";
import { post } from "@/lib/api";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function AddPrompt() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    aiTool: "",
    tags: [],
    difficultyLevel: "Beginner",
    thumbnail: "",
    visibility: "public",
    featured: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPrompt = {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        userEmail: session?.user?.email || "",
      };

      console.log(newPrompt);

      const res = await post("/prompts", newPrompt);
      if (res) {
        toast.success("Prompt Added Successfully!");
        setFormData({
          title: "",
          description: "",
          content: "",
          category: "",
          aiTool: "",
          tags: [],
          difficultyLevel: "Beginner",
          thumbnail: "",
          visibility: "public",
          featured: false,
        });
      }
    } catch (err) {
      toast.error("Failed to add prompt");
      console.error(err);
    }
  };

  return (
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

      <button type="submit" className="btn btn-primary w-full">
        Add Prompt
      </button>
    </form>
  );
}
