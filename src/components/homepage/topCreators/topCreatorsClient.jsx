"use client";
import { motion } from "framer-motion";
import { FaMedal } from "react-icons/fa";

export default function TopCreatorsClient({ creators }) {
  return (
    <section className="container-xy">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="section-title"
      >
        Top Creators
      </motion.h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {creators.slice(0, 4).map((creator, idx) => (
          <motion.div
            key={creator._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="card bg-base-100 shadow-lg p-6 rounded-lg hover:shadow-xl transition relative"
          >
            <div className="absolute top-4 left-4">
              <FaMedal
                className={`text-2xl ${
                  idx === 0
                    ? "text-yellow-500"
                    : idx === 1
                      ? "text-gray-400"
                      : idx === 2
                        ? "text-orange-500"
                        : "text-indigo-400"
                }`}
              />
            </div>

            <div className="avatar placeholder mx-auto mb-4">
              <div className="bg-neutral text-neutral-content rounded-full w-24 border-4 border-indigo-600">
                <span className="text-3xl">
                  {creator._id?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2 text-center">
              {creator._id}
            </h3>
            <div className="text-center text-sm text-base-content/70 space-y-1">
              <p>{creator.totalPrompts} Prompts</p>
              <p>{creator.totalCopies} Total Copies</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
