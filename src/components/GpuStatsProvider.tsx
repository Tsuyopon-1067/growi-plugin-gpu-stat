import { useGpuStats } from "../hooks/useGpuStats";
import { GpuStatsContext } from "./GpuStatsContext";

interface GpuStatsProviderProps {
  children: React.ReactNode;
}

export function GpuStatsProvider({ children }: GpuStatsProviderProps) {
  const gpuStats = useGpuStats();

  return (
    <GpuStatsContext.Provider value={gpuStats}>
      {children}
    </GpuStatsContext.Provider>
  );
}