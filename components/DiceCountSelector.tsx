"use client";

import {
  VALID_DICE_COUNTS,
  type DiceCount,
  isValidDiceCount,
  validationMessageForCount,
} from "@/lib/dice";
import { useCallback, useId, useState } from "react";

type DiceCountSelectorProps = {
  value: DiceCount;
  onChange: (count: DiceCount) => void;
  disabled?: boolean;
};

export function DiceCountSelector({
  value,
  onChange,
  disabled = false,
}: DiceCountSelectorProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const applyCount = useCallback(
    (next: number) => {
      const message = validationMessageForCount(next);
      if (message) {
        setError(message);
        return false;
      }
      if (isValidDiceCount(next)) {
        setError(null);
        onChange(next);
        return true;
      }
      setError(`Choose ${VALID_DICE_COUNTS.join(", ")}.`);
      return false;
    },
    [onChange],
  );

  const step = (delta: number) => {
    const idx = VALID_DICE_COUNTS.indexOf(value);
    const nextIdx = Math.min(
      VALID_DICE_COUNTS.length - 1,
      Math.max(0, idx + delta),
    );
    setError(null);
    onChange(VALID_DICE_COUNTS[nextIdx]);
  };

  const handleCustomSubmit = () => {
    const parsed = parseInt(customInput.trim(), 10);
    if (Number.isNaN(parsed)) {
      setError("Enter a number, or pick from the list.");
      return;
    }
    applyCount(parsed);
    setCustomInput("");
  };

  return (
    <div className="w-full max-w-md space-y-3">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-zinc-300"
      >
        Number of dice
      </label>
      <div className="flex flex-wrap items-stretch gap-2">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={disabled || value === VALID_DICE_COUNTS[0]}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-800 text-lg text-zinc-100 transition hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Fewer dice"
        >
          −
        </button>
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            setError(null);
            onChange(Number(e.target.value) as DiceCount);
          }}
          className="h-11 min-w-[5rem] flex-1 rounded-lg border border-zinc-600 bg-zinc-800 px-3 text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:opacity-50"
          aria-describedby={`${hintId}${error ? ` ${errorId}` : ""}`}
        >
          {VALID_DICE_COUNTS.map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "die" : "dice"}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={
            disabled || value === VALID_DICE_COUNTS[VALID_DICE_COUNTS.length - 1]
          }
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-600 bg-zinc-800 text-lg text-zinc-100 transition hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="More dice"
        >
          +
        </button>
      </div>
      <p id={hintId} className="text-xs text-zinc-500">
        Allowed: 1, 2, or even counts up to 12 (4, 6, 8, 10, 12).
      </p>
      <div className="flex flex-wrap gap-2">
        <input
          type="number"
          min={1}
          max={12}
          inputMode="numeric"
          placeholder="Try a custom count…"
          value={customInput}
          disabled={disabled}
          onChange={(e) => {
            setCustomInput(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCustomSubmit();
            }
          }}
          className="h-10 min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:opacity-50"
          aria-label="Custom dice count"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hintId}
        />
        <button
          type="button"
          onClick={handleCustomSubmit}
          disabled={disabled || !customInput.trim()}
          className="h-10 rounded-lg border border-zinc-600 bg-zinc-800 px-4 text-sm font-medium text-zinc-200 hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 disabled:opacity-40"
        >
          Apply
        </button>
      </div>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="rounded-lg border border-amber-900/50 bg-amber-950/40 px-3 py-2 text-sm text-amber-200"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
