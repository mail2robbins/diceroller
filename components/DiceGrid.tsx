"use client";

import { Die } from "@/components/Die";

type DiceGridProps = {
  values: number[];
  rolling?: boolean;
};

export function DiceGrid({ values, rolling = false }: DiceGridProps) {
  const count = values.length;
  const gridClass =
    count <= 2
      ? "grid-cols-2 max-w-xs"
      : count <= 4
        ? "grid-cols-2 sm:grid-cols-4 max-w-md"
        : count <= 6
          ? "grid-cols-3 sm:grid-cols-6 max-w-2xl"
          : "grid-cols-4 sm:grid-cols-6 max-w-3xl";

  return (
    <div
      className={`mx-auto grid w-full justify-items-center gap-3 sm:gap-4 ${gridClass}`}
      role="list"
      aria-label={rolling ? "Dice rolling" : `${count} dice showing results`}
    >
      {values.map((v, i) => (
        <div key={`${i}-${rolling ? "r" : v}`} role="listitem">
          <Die value={v} rolling={rolling} index={i} />
        </div>
      ))}
    </div>
  );
}
