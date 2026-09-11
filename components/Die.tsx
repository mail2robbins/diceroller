"use client";

/** Pip positions on a 3×3 grid (row, col), 0-indexed. */
const PIP_LAYOUT: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2],
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  4: [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ],
  5: [
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ],
  6: [
    [0, 0],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 2],
  ],
};

type DieProps = {
  value: number;
  rolling?: boolean;
  index?: number;
};

export function Die({ value, rolling = false, index = 0 }: DieProps) {
  const face = Math.min(6, Math.max(1, value));
  const pips = PIP_LAYOUT[face] ?? PIP_LAYOUT[1];

  return (
    <div
      className={`die relative aspect-square w-full max-w-[4.5rem] rounded-xl border-2 border-zinc-600 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-lg shadow-black/40 ${
        rolling ? "die-rolling" : ""
      }`}
      style={{ animationDelay: rolling ? `${index * 40}ms` : undefined }}
      role="img"
      aria-label={rolling ? "Die rolling" : `Die showing ${face}`}
    >
      <div className="grid h-full w-full grid-cols-3 grid-rows-3 gap-0 p-[18%]">
        {Array.from({ length: 9 }).map((_, cell) => {
          const row = Math.floor(cell / 3);
          const col = cell % 3;
          const show = pips.some(([r, c]) => r === row && c === col);
          return (
            <span
              key={cell}
              className={`m-auto rounded-full bg-red-500 shadow-inner ${
                show ? "h-[65%] w-[65%] opacity-100" : "h-0 w-0 opacity-0"
              }`}
              aria-hidden
            />
          );
        })}
      </div>
    </div>
  );
}
