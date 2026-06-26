"use client";

import React from "react";
import Link from "next/link";
import { HiLightningBolt } from "react-icons/hi";
import { FaTwitter, FaGithub, FaDiscord } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#05070B] border-t border-white/5 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Summary Box */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-violet-600 to-amber-500 p-1.5 rounded-lg shadow-sm">
                <HiLightningBolt className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Prompt<span className="text-amber-500">Bazaar</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              The premium, decentralized AI engine optimization marketplace for
              modern engineers and creative prompt technologists.
            </p>
          </div>

          {/* Links Column A */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Marketplace
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/prompts?category=midjourney"
                  className="hover:text-amber-500 transition-colors"
                >
                  Midjourney Prompts
                </Link>
              </li>
              <li>
                <Link
                  href="/prompts?category=chatgpt"
                  className="hover:text-amber-500 transition-colors"
                >
                  ChatGPT Engineering
                </Link>
              </li>
              <li>
                <Link
                  href="/prompts?category=stable-diffusion"
                  className="hover:text-amber-500 transition-colors"
                >
                  Stable Diffusion Vectors
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column B */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Platform Core
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-amber-500 transition-colors"
                >
                  Pricing Matrices
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="hover:text-amber-500 transition-colors"
                >
                  Creator Standings
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-amber-500 transition-colors"
                >
                  License Agreement
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Vectors */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-4">
              Connect Ecosystem
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-lg"
              >
                <FaTwitter />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-lg"
              >
                <FaGithub />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors text-lg"
              >
                <FaDiscord />
              </a>
            </div>
            <p className="text-xs text-slate-600">
              Real-time synchronization with active global AI clusters.
            </p>
          </div>
        </div>

        {/* Structural Isolation Strip */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Prompt Bazaar Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
