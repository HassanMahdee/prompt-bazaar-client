"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button, Card, CardBody, Pagination, Spinner } from "@heroui/react";
import {
  FiSearch,
  FiFilter,
  FiCpu,
  FiLayers,
  FiActivity,
  FiCopy,
  FiRefreshCw,
} from "react-icons/fi";

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Primary application variables populated entirely through backend runtime pipelines
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States synchronized dynamically from active URL queries
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [aiTool, setAiTool] = useState(searchParams.get("aiTool") || "");
  const [difficulty, setDifficulty] = useState(
    searchParams.get("difficulty") || "",
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") || "1", 10),
  );
  const [totalPages, setTotalPages] = useState(1);
  const [totalPrompts, setTotalPrompts] = useState(0);

  // Structural selector configuration constants
  const categoryOptions = [
    "Development",
    "Copywriting",
    "Digital Art",
    "Marketing",
    "SEO",
  ];
  const aiToolOptions = ["ChatGPT", "Midjourney", "Claude", "Stable Diffusion"];
  const difficultyOptions = ["Easy", "Medium", "Advanced"];
  const sortOptions = [
    { value: "latest", label: "Newest Arrivals" },
    { value: "popular", label: "Highest Rated" },
    { value: "copied", label: "Most Copied String" },
  ];

  // Dynamic integration engine running backend pagination pipelines
  const fetchPromptsData = useCallback(async () => {
    setLoading(true);
    try {
      const urlQuery = new URLSearchParams({
        page: page.toString(),
        search: search.trim(),
        category,
        aiTool,
        difficulty,
        sort,
      });

      const serverUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const apiResponse = await fetch(
        `${serverUrl}/api/prompts?${urlQuery.toString()}`,
      );

      if (apiResponse.ok) {
        const dataResult = await apiResponse.json();
        setPrompts(dataResult.prompts || []);
        setTotalPages(dataResult.totalPages || 1);
        setTotalPrompts(dataResult.totalPrompts || 0);
      }
    } catch (err) {
      console.error(
        "API network link dropped. Ensure prompt-bazaar-server is active:",
        err,
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, category, aiTool, difficulty, sort]);

  // Fetch data when filter parameters change
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const urlQuery = new URLSearchParams({
          page: page.toString(),
          search: search.trim(),
          category,
          aiTool,
          difficulty,
          sort,
        });

        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const apiResponse = await fetch(
          `${serverUrl}/api/prompts?${urlQuery.toString()}`,
        );

        if (apiResponse.ok && isMounted) {
          const dataResult = await apiResponse.json();
          setPrompts(dataResult.prompts || []);
          setTotalPages(dataResult.totalPages || 1);
          setTotalPrompts(dataResult.totalPrompts || 0);
        }
      } catch (err) {
        console.error(
          "API network link dropped. Ensure prompt-bazaar-server is active:",
          err,
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [page, search, category, aiTool, difficulty, sort]);

  // Synchronize parameter selections with browser history states
  useEffect(() => {
    const syncQuery = new URLSearchParams();
    if (search) syncQuery.set("search", search);
    if (category) syncQuery.set("category", category);
    if (aiTool) syncQuery.set("aiTool", aiTool);
    if (difficulty) syncQuery.set("difficulty", difficulty);
    if (sort) syncQuery.set("sort", sort);
    syncQuery.set("page", page.toString());

    router.replace(`/prompts?${syncQuery.toString()}`, { scroll: false });
  }, [page, category, aiTool, difficulty, sort, router, search]);

  const executeSearchForm = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPromptsData();
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("");
    setAiTool("");
    setDifficulty("");
    setSort("latest");
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-foreground min-h-screen">
      {/* FILTER CATALOG TOPBAR OVERVIEW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            AI Command Marketplace
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Displaying{" "}
            <span className="text-accent font-semibold">{totalPrompts}</span>{" "}
            database rows under current filter conditions.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs text-gray-400 whitespace-nowrap font-medium flex items-center gap-1.5">
            <FiActivity /> Sort:
          </label>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="select select-sm bg-obsidian-light border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-primary w-full md:w-48"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* INTERACTIVE CONTROLS CONSOLE SIDEBAR */}
        <aside className="lg:col-span-1 glass-panel p-6 rounded-2xl space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
              <FiFilter className="text-primary" /> Filter Matrix
            </h2>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-gray-400 hover:text-secondary flex items-center gap-1 transition-colors"
            >
              <FiRefreshCw className="text-[10px]" /> Reset
            </button>
          </div>

          <div className="space-y-4">
            <div className="form-control w-full space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <FiLayers /> Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="select select-sm w-full bg-obsidian-deep border-white/5 rounded-xl text-xs text-gray-300"
              >
                <option value="">All Categories</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-full space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <FiCpu /> Target System
              </label>
              <select
                value={aiTool}
                onChange={(e) => {
                  setAiTool(e.target.value);
                  setPage(1);
                }}
                className="select select-sm w-full bg-obsidian-deep border-white/5 rounded-xl text-xs text-gray-300"
              >
                <option value="">All Engines</option>
                {aiToolOptions.map((tool) => (
                  <option key={tool} value={tool}>
                    {tool}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-full space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                <FiActivity /> Complexity
              </label>
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  setPage(1);
                }}
                className="select select-sm w-full bg-obsidian-deep border-white/5 rounded-xl text-xs text-gray-300"
              >
                <option value="">All Levels</option>
                {difficultyOptions.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* PROMPT LAYOUT CONTROLLER GRID */}
        <main className="lg:col-span-3 space-y-6">
          <form onSubmit={executeSearchForm} className="flex gap-3">
            <div className="relative w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
              <input
                type="text"
                placeholder="Query live text indexes across title or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-obsidian-light/50 border border-white/10 rounded-xl text-xs text-white"
              />
            </div>
            <Button
              type="submit"
              color="primary"
              size="sm"
              className="rounded-xl px-5 text-xs"
            >
              Search
            </Button>
          </form>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-2">
              <Spinner color="primary" size="lg" />
              <p className="text-xs text-gray-400">
                Querying Express data pipelines...
              </p>
            </div>
          ) : prompts.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl text-center space-y-2">
              <p className="text-sm font-semibold text-gray-300">
                No prompts found matching your filters.
              </p>
              <Button
                onClick={handleResetFilters}
                size="sm"
                variant="flat"
                color="secondary"
                className="rounded-xl mt-2 text-xs"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prompts.map((p) => (
                <Card
                  key={p._id}
                  className="glass-panel bg-transparent border-white/5 shadow-none rounded-2xl overflow-hidden hover:border-primary/20 transition-all duration-300"
                >
                  <CardBody className="p-5 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-primary/20 text-accent border border-primary/20">
                          {p.aiTool}
                        </span>
                        <span className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-md">
                          {p.category}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-100 tracking-tight">
                        {p.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiCopy /> <strong>{p.copies || 0}</strong> copies
                      </span>
                      <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                        {p.difficulty || "Medium"}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}

          {/* SYSTEM PAGINATION CONTROLLER LINKS */}
          {totalPages > 1 && (
            <div className="flex justify-center pt-8 border-t border-white/5">
              <Pagination
                total={totalPages}
                page={page}
                onChange={(nextIndex) => setPage(nextIndex)}
                color="primary"
                radius="xl"
                size="sm"
                classNames={{
                  item: "bg-obsidian-light text-gray-400 hover:text-white border border-white/5 transition-colors",
                  active: "bg-primary text-white font-bold",
                }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian py-20 space-y-2">
          <Spinner color="primary" size="lg" />
          <p className="text-xs text-gray-400">
            Synchronizing database views...
          </p>
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
