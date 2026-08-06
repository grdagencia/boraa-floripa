"use client";

import { motion } from "framer-motion";

export function ProgressBar({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const percentage = total ? (completed / total) * 100 : 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="font-display text-lg font-black sm:text-2xl">
          {completed} de {total} missões concluídas
        </p>
        <span className="font-display text-xl font-black text-coral">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-ink/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-coral to-orange-400"
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </div>
    </div>
  );
}
