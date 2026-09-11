"use client";

import type { RollRecord } from "@/lib/dice";

type RollHistoryListProps = {
  history: RollRecord[];
  hydrated: boolean;
};

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function RollHistoryList({ history, hydrated }: RollHistoryListProps) {
  return (
    <section
      className="flex w-full max-w-3xl flex-col gap-3"
      aria-labelledby="roll-history-heading"
    >
      <h2
        id="roll-history-heading"
        className="text-lg font-semibold text-[var(--color-text-primary)] font-display"
      >
        Roll history
      </h2>
      <div
        className="max-h-56 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 sm:max-h-64"
        tabIndex={0}
        role="region"
        aria-label="Last ten rolls"
      >
        {!hydrated ? (
          <p className="px-2 py-4 text-sm text-[var(--color-text-muted)]">Loading history…</p>
        ) : history.length === 0 ? (
          <p className="px-2 py-4 text-sm text-[var(--color-text-muted)]">
            No rolls yet. Hit Roll to start.
          </p>
        ) : (
          <ul className="space-y-2">
            {history.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-primary-dark)] px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-[var(--color-text-secondary)]">
                    {entry.diceCount}{" "}
                    {entry.diceCount === 1 ? "die" : "dice"} · sum{" "}
                    <span className="text-[var(--color-accent)]">{entry.sum}</span>
                  </span>
                  <time
                    className="text-xs text-[var(--color-text-muted)]"
                    dateTime={new Date(entry.timestamp).toISOString()}
                  >
                    {formatTime(entry.timestamp)}
                  </time>
                </div>
                <p className="mt-1 font-mono text-xs text-[var(--color-text-muted)]">
                  [{entry.values.join(", ")}]
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
