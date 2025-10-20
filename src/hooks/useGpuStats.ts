import React from "react";
import { growiReact } from "@growi/pluginkit";
import type { GpuStat } from "../lib/models";
import { fetchGpuStats } from "../lib/gpuStats";

const API_URL = import.meta.env.VITE_GPU_STAT_API_URL || "/__gpustat__";

export function useGpuStats() {
  const growiReactInstance = growiReact(React);
  const { useState, useCallback, useEffect } = growiReactInstance;

  const [stats, setStats] = useState<GpuStat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastClientUpdate, setLastClientUpdate] = useState<Date | null>(null);
  const [lastApiUpdate, setLastApiUpdate] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const { stats, lastModified } = await fetchGpuStats(API_URL);
      setStats(stats);
      setLastApiUpdate(lastModified);
      setLastClientUpdate(new Date());
    } catch (err) {
      console.error(err);
      setError("Failed to fetch GPU stats.");
    }
  }, []);

  useEffect(() => {
    fetchData();
    // request every 30s
    const intervalId = setInterval(fetchData, 30000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  return { stats, error, lastClientUpdate, lastApiUpdate, refresh: fetchData };
}
