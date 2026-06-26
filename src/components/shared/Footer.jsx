import Link from "next/link";
import {
  HiOutlineCode,
  HiOutlineGlobeAlt,
  HiOutlineTerminal,
} from "react-icons/hi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerGroups = [
    {
      title: "Marketplace Matrices",
      links: [
        { name: "LLM Synthetics", href: "/marketplace?category=llm" },
        {
          name: "Diffusion Architecture",
          href: "/marketplace?category=diffusion",
        },
        {
          name: "Automation Pipelines",
          href: "/marketplace?category=automations",
        },
        { name: "Trending Pipelines", href: "/marketplace?sort=popular" },
      ],
    },
    {
      title: "Core Protocols",
      links: [
        { name: "API Documentation", href: "/docs/api" },
        { name: "Better Auth Integration", href: "/docs/auth" },
        { name: "Aggregation Models", href: "/docs/aggregation" },
        { name: "System Terminal Status", href: "/status" },
      ],
    },
    {
      title: "Platform Shell",
      links: [
        { name: "Enterprise Contracts", href: "/enterprise" },
        { name: "Security Verification", href: "/security" },
        { name: "Terms of Compliance", href: "/terms" },
        { name: "Privacy Node Data", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-obsidian-deep border-t border-white/5 mt-auto relative overflow-hidden">
      {/* Structural Containment Grid Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-white/5">
          {/* Section 1: Core Brand Narrative Block */}
          <div className="sm:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-white">
                PROMPT<span className="text-violet-electric">BAZAAR</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-sm">
              The premier decentralized sandbox ecosystem built specifically for
              searching, trading, authenticating, and embedding optimization
              blocks for neural network engines.
            </p>
            {/* System Status Indicators Row */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 text-emerald-400 text-[11px] font-mono rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              All Processing Matrix Nodes Operational
            </div>
          </div>

          {/* Section 2: Iterating Structural Matrix link listings */}
          {footerGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="font-display text-xs font-bold text-white uppercase tracking-wider">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-slate-400 hover:text-amber-gold transition-colors font-sans duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Platform Licensing Frame and Social Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-500 font-sans tracking-tight">
            &copy; {currentYear} Prompt Bazaar Inc. Submitted as academic
            certification artifact framework block. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Github Trace Log"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
            >
              <HiOutlineCode className="w-4 h-4" />
            </a>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Network Cluster Node"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
            >
              <HiOutlineTerminal className="w-4 h-4" />
            </a>
            <a
              href="https://google.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Global Matrix Anchor"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
            >
              <HiOutlineGlobeAlt className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
