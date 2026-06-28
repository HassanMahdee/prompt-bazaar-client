"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SearchBar from "./searchBar";
import FilterBar from "./filterBar";
import SortBar from "./sortBar";
import PromptCard from "./promptCard";
import { get } from "@/lib/api";

export default function AllPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, filter, and sort state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [aiTool, setAiTool] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          search: search || undefined,
          category: category || undefined,
          difficulty: difficulty || undefined,
          aiTool: aiTool || undefined,
          sort: sort,
          page: page,
          limit: 12,
        };

        const response = await get("/prompts", params);
        setPrompts(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load prompts");
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [search, category, difficulty, aiTool, sort, page]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "category") setCategory(value);
    if (filterType === "difficulty") setDifficulty(value);
    if (filterType === "aiTool") setAiTool(value);
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSort(value);
    setPage(1);
  };

  return (
    <div className="container-xy">
      <h1 className="section-title">All Prompts</h1>

      {/* Search, Filter, and Sort Section */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 justify-between">
        <div className="flex flex-1">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="flex gap-4">
          <FilterBar
            onFilterChange={handleFilterChange}
            selectedCategory={category}
            selectedDifficulty={difficulty}
            selectedAiTool={aiTool}
            prompts={prompts}
          />
          <SortBar onSortChange={handleSortChange} selectedSort={sort} />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && prompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-base-content/70">No prompts found</p>
        </div>
      )}

      {/* Prompts Grid */}
      {!loading && !error && prompts.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {prompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                className="btn btn-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span className="btn btn-sm btn-disabled">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
