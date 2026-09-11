"use client";

import { Die } from "@/components/Die";

type DiceGridProps = {
  values: number[];
  rolling?: boolean;
};

export function DiceGrid({ values, rolling = false }: DiceGridProps) {
  const count = values.length;
  
  return (
    <div
      className="mx-auto flex w-full flex-wrap justify-center gap-4 sm:gap-6"
      role="list"
      aria-label={rolling ? "Dice rolling" : `${count} dice showing results`}
    >
      {values.map((v, i) => (
        <div key={`${i}-${rolling ? "r" : v}`} role="listitem" className="inline-flex">
          <Die value={v} rolling={rolling} index={i} />
        </div>
      ))}
    </div>
  );
}
