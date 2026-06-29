"use client";

import { post } from "@/lib/api";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Image from "next/image";

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
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const formDataImg = new FormData();
      formDataImg.append("image", file);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formDataImg,
        },
      );

      const data = await res.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          thumbnail: data.data.url, // ✅ imgbb থেকে URL আসবে
        }));
        toast.success("Image uploaded!");
      }
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

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
        <label>Thumbnail Image</label>

        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input file-input-bordered w-full"
        />

        {/* Loading */}
        {imageUploading && (
          <p className="text-sm text-gray-500 mt-1">Uploading... ⏳</p>
        )}

        {/* Preview */}
        {formData.thumbnail && !imageUploading && (
          <Image
            src={formData.thumbnail}
            alt="Thumbnail Preview"
            width={160}
            height={96}
            className="mt-2 w-40 h-24 object-cover rounded-lg"
          />
        )}
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
