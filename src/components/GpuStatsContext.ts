import { createContext } from "react";
import type { GpuStat } from "../lib/models";

export interface GpuStatsContextType {
  stats: GpuStat[];
  error: string | null;
  lastClientUpdate: Date | null;
  lastApiUpdate: string | null;
  refresh: () => Promise<void>;
}

export const GpuStatsContext = createContext<GpuStatsContextType | null>(null);
