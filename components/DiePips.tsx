/** Pip positions on a 3×3 grid (row, col), 0-indexed. */
export const PIP_LAYOUT: Record<number, [number, number][]> = {
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

type DiePipsProps = {
  value: number;
  className?: string;
};

export function DiePips({ value, className = "" }: DiePipsProps) {
  const face = Math.min(6, Math.max(1, value));
  const pips = PIP_LAYOUT[face] ?? PIP_LAYOUT[1];

  return (
    <div
      className={`grid h-full w-full grid-cols-3 grid-rows-3 gap-0 p-[16%] ${className}`}
      aria-hidden
    >
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
          />
        );
      })}
    </div>
  );
}
