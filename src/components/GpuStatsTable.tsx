import type { GpuStat } from "../lib/models";

interface GpuStatsTableProps {
  stats: GpuStat[];
}

const isAvailable = (value: number | undefined) => {
  return value !== undefined && value !== null;
};

export function GpuStatsTable({ stats }: GpuStatsTableProps) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full bg-white text-xl">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b-2 border-stone-200">サーバ</th>
            <th className="py-2 px-3 border-b-2 border-stone-200">GPU</th>
            <th className="py-2 px-3 border-b-2 border-stone-200">温度</th>
            <th className="py-2 px-3 border-b-2 border-stone-200">計算負荷</th>
            <th className="py-2 px-3 border-b-2 border-stone-200">
              メモリ (GiB)
            </th>
            <th className="py-2 px-3 border-b-2 border-stone-200">利用者</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) =>
            stat.gpus.map((gpu, gpuIndex) => {
              const isLastGpuInHost = gpuIndex === stat.gpus.length - 1;
              const cellClassName = `py-2 px-1 ${
                isLastGpuInHost ? "border-b-2 border-stone-200" : ""
              }`;
              const centeredCellClassName = `${cellClassName} text-center`;
              const displayedGpuName = gpu.name?.replace(
                "Ada Generation",
                "Ada"
              );
              const gpuUtilization = gpu["utilization.gpu"] ?? 0;
              const gpuUtilization80 = Math.max(gpuUtilization - 80, 0);
              const gpuUtilizationEmojiSize = (gpuUtilization80 / 20) * 16;
              return (
                <tr
                  key={`${stat.hostname}-${gpu.uuid}`}
                  className="hover:bg-gray-50"
                >
                  <td className={cellClassName}>
                    {gpuIndex === 0 ? stat.hostname : ""}
                  </td>
                  <td className={cellClassName}>{displayedGpuName}</td>
                  <td className={centeredCellClassName}>
                    {gpu["temperature.gpu"]} °C
                  </td>
                  <td className={centeredCellClassName}>
                    {gpu["utilization.gpu"]} %
                    <span
                      className="ml-1"
                      style={{ fontSize: gpuUtilizationEmojiSize + "px" }}
                    >
                      🔥
                    </span>
                  </td>
                  <td className={centeredCellClassName}>
                    {(() => {
                      const memoryUsed = gpu["memory.used"];
                      const memoryTotal = gpu["memory.total"];
                      const memoryUsedGib = isAvailable(memoryUsed)
                        ? (memoryUsed / 1024).toFixed(1)
                        : "N/A";
                      const memoryTotalGib = isAvailable(memoryTotal)
                        ? (memoryTotal / 1024).toFixed(1)
                        : "N/A";
                      let emoji = "";
                      if (isAvailable(memoryUsed) && isAvailable(memoryTotal)) {
                        const memoryUsedRatio = memoryUsed / memoryTotal;
                        if (memoryUsedRatio >= 0.9) {
                          emoji = "😭";
                        } else if (memoryUsedRatio >= 0.8) {
                          emoji = "😢️";
                        } else if (memoryUsedRatio >= 0.7) {
                          emoji = "🥺️";
                        }
                      }
                      return `${memoryUsedGib} / ${memoryTotalGib} ${emoji}`;
                    })()}
                  </td>
                  <td className={cellClassName}>
                    {gpu.processes
                      ?.map((p) => {
                        const memoryInGb = p.gpu_memory_usage
                          ? (p.gpu_memory_usage / 1024).toFixed(1)
                          : "N/A";
                        return `${p.username} (${memoryInGb}GiB)`;
                      })
                      .join(", ")}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
