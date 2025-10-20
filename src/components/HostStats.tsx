import { GpuStat } from "../lib/models";
import { IndividualGpu } from "./IndividualGpu";

interface HostStatsProps {
  stat: GpuStat;
}

export function HostStats({ stat }: HostStatsProps) {
  return (
    <div>
      {stat.gpus.map((gpu) => (
        <IndividualGpu key={gpu.index} gpu={gpu} />
      ))}
    </div>
  );
}
