"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Spinner } from "@heroui/react";
import {
  FiArrowRight,
  FiCpu,
  FiLayers,
  FiZap,
  FiCopy,
  FiTrendingUp,
  FiSearch,
} from "react-icons/fi";

export default function HomePage() {
  const router = useRouter();
  const [quickSearch, setQuickSearch] = useState("");
  const [topPrompts, setTopPrompts] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Icon Selector helper based on database category names
  const getCategoryIcon = (categoryName) => {
    switch (categoryName?.toLowerCase()) {
      case "development":
        return <FiCpu className="text-xl text-primary" />;
      case "copywriting":
        return <FiLayers className="text-xl text-secondary" />;
      case "digital art":
        return <FiZap className="text-xl text-accent" />;
      default:
        return <FiTrendingUp className="text-xl text-success" />;
    }
  };

  // Fetch data live from the Express database backend on mount
  useEffect(() => {
    async function loadPlatformDashboard() {
      setLoading(true);
      try {
        const serverUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // 1. Fetch Top Prompts Spotlight dynamically based on highest copy metrics
        const promptsRes = await fetch(
          `${serverUrl}/api/prompts?limit=3&sort=copied`,
        );
        if (promptsRes.ok) {
          const promptsData = (await promptsRes.ok)
            ? await promptsRes.json()
            : {};
          setTopPrompts(promptsData.prompts || []);
        }

        // 2. Fetch live aggregate category metrics from your MongoDB controller route
        const analyticsRes = await fetch(`${serverUrl}/api/prompts/analytics`);
        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          setCategoryStats(analyticsData.categoryStats || []);
        }
      } catch (err) {
        console.error(
          "Failed to connect with database server parameters:",
          err,
        );
      } finally {
        setLoading(false);
      }
    }
    loadPlatformDashboard();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      router.push(`/prompts?search=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      router.push("/prompts");
    }
  };

  return (
    <div className="min-h-screen text-foreground">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-obsidian-light/60 text-xs text-accent backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            Live Database Connected Ecosystem
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none">
            Unlock Premium AI Command Strings at{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Prompt Bazaar
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto">
            Discover, test, and extract instruction parameters built directly by
            verified engineers. Powered by real-time server-side
            synchronization.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto pt-4"
          >
            <div className="relative w-full">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
              <input
                type="text"
                placeholder="Search database prompt records..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-obsidian-deep/80 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-sm transition-all shadow-inner text-white"
              />
            </div>
            <Button
              type="submit"
              color="primary"
              className="w-full sm:w-auto font-medium px-6 py-6 rounded-xl shadow-lg"
            >
              Explore Now <FiArrowRight />
            </Button>
          </form>
        </div>
      </section>

      {/* 2. DYNAMIC LIVE CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Active Engine Categories
          </h2>
          <p className="text-sm text-gray-400">
            Aggregated directly from active items inside our database instance
            logs.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner color="primary" size="md" />
          </div>
        ) : categoryStats.length === 0 ? (
          <div className="text-center p-8 bg-white/5 rounded-2xl text-xs text-gray-400">
            No category strings discovered in the database yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryStats.map((cat, idx) => (
              <Link
                key={idx}
                href={`/prompts?category=${encodeURIComponent(cat._id)}`}
                className="group"
              >
                <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between hover:border-primary/40 hover:shadow-glass-glow transition-all duration-300">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      {getCategoryIcon(cat._id)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {cat._id || "Uncategorized"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Total tracked copies:{" "}
                        <strong className="text-gray-200 font-medium">
                          {cat.totalCopies || 0}
                        </strong>{" "}
                        across all engineering runs.
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-accent font-medium mt-6 flex items-center gap-1 group-hover:underline">
                    {cat.count || 0} Active Prompts{" "}
                    <FiArrowRight className="text-xs inline" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. DYNAMIC TOP SPOTLIGHT PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 py-16 bg-gradient-to-b from-transparent via-obsidian-light/20 to-transparent rounded-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Spotlight Top Prompts
            </h2>
            <p className="text-sm text-gray-400">
              High-performing instruction arrays actively extracted by platform
              consumers.
            </p>
          </div>
          <Link href="/prompts">
            <Button
              variant="bordered"
              className="border-white/10 hover:border-primary text-gray-300 rounded-xl text-xs"
            >
              View Complete Catalog
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner color="primary" size="md" />
          </div>
        ) : topPrompts.length === 0 ? (
          <div className="text-center p-12 bg-white/5 rounded-2xl text-xs text-gray-400">
            No prompt models currently saved on the database cluster.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topPrompts.map((prompt) => (
              <Card
                key={prompt._id}
                className="glass-panel border-white/5 bg-transparent shadow-none rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-accent border border-primary/30">
                      {prompt.aiTool}
                    </span>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-gray-400 bg-white/5 px-2 py-0.5 rounded-md">
                        {prompt.category}
                      </span>
                      <span className="text-secondary bg-secondary/10 px-2 py-0.5 rounded-md">
                        {prompt.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-gray-100 tracking-tight line-clamp-1">
                      {prompt.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed pt-1">
                      {prompt.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <FiCopy className="text-gray-400" />
                      <span>
                        <strong className="text-gray-300 font-semibold">
                          {prompt.copies || 0}
                        </strong>{" "}
                        uses
                      </span>
                    </div>
                    <Link href={`/prompts?id=${prompt._id}`}>
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        className="rounded-lg text-xs font-medium bg-primary/10 text-accent"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
