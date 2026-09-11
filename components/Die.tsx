"use client";

import { DiePips } from "@/components/DiePips";

type DieProps = {
  value: number;
  rolling?: boolean;
  index?: number;
};

export function Die({ value, rolling = false, index = 0 }: DieProps) {
  const face = Math.min(6, Math.max(1, value));

  return (
    <div
      className={`die relative aspect-square w-full max-w-[8rem] rounded-xl border-2 border-zinc-600 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-lg shadow-black/40 ${
        rolling ? "die-rolling" : ""
      }`}
      style={{ animationDelay: rolling ? `${index * 40}ms` : undefined }}
      role="img"
      aria-label={rolling ? "Die rolling" : `Die showing ${face}`}
    >
      <DiePips value={face} />
    </div>
  );
}
