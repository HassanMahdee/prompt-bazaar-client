"use client";
import {
  FaSearch,
  FaBolt,
  FaRobot,
  FaLightbulb,
  FaMagic,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroBanner() {
  const trendingTags = [
    { icon: <FaBolt />, label: "Automation" },
    { icon: <FaRobot />, label: "AI Prompts" },
    { icon: <FaLightbulb />, label: "Productivity" },
    { icon: <FaMagic />, label: "Creativity" },
  ];

  return (
    <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6"
        >
          Supercharge Your Workflow with AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl mb-8 opacity-90"
        >
          Discover powerful prompts, boost productivity, and unlock creativity
          through automation.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mb-6"
        >
          <div className="form-control w-full max-w-md">
            <div className="input-group flex gap-2">
              <input
                type="text"
                placeholder="Search prompts..."
                className="input input-bordered w-full text-black"
              />
              <Link href="/all-prompts" className="btn btn-primary">
                <FaSearch className="mr-2" /> Search
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Trending Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {trendingTags.map((tag, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.7 + idx * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-indigo-600 font-semibold shadow hover:bg-indigo-100 cursor-pointer transition"
            >
              {tag.icon} {tag.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Call-To-Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link
            href="/all-prompts"
            className="btn btn-secondary btn-lg shadow-lg"
          >
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
