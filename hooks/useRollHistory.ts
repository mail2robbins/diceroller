"use client";

import { useCallback, useEffect, useState } from "react";
import {
  HISTORY_STORAGE_KEY,
  MAX_HISTORY,
  type RollRecord,
  SOUND_ENABLED_KEY,
} from "@/lib/dice";

function readHistory(): RollRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RollRecord[];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_HISTORY);
  } catch {
    return [];
  }
}

function readSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(SOUND_ENABLED_KEY);
    if (raw === null) return true;
    return raw === "true";
  } catch {
    return true;
  }
}

export function useRollHistory() {
  const [history, setHistory] = useState<RollRecord[]>([]);
  const [soundEnabled, setSoundEnabledState] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHistory(readHistory());
    setSoundEnabledState(readSoundEnabled());
    setHydrated(true);
  }, []);

  const pushRoll = useCallback((record: RollRecord) => {
    setHistory((prev) => {
      const next = [record, ...prev].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* quota or private mode */
      }
      return next;
    });
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    try {
      localStorage.setItem(SOUND_ENABLED_KEY, String(enabled));
    } catch {
      /* ignore */
    }
  }, []);

  return {
    history,
    pushRoll,
    soundEnabled,
    setSoundEnabled,
    hydrated,
  };
}
