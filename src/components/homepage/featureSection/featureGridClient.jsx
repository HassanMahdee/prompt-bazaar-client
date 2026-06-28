"use client"; // ✅ এখানে motion কাজ করবে
import { motion } from "framer-motion";
import FeatureCard from "./featureCard";

export default function FeatureGridClient({ prompts }) {
  return (
    <div className="container-xy">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="section-title"
      >
        Featured Prompts
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.slice(0, 6).map((prompt, idx) => (
          <motion.div
            key={prompt._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <FeatureCard prompt={prompt} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
