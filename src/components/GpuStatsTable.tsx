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
      <table className="w-full bg-white text-3xl">
        <thead>
          <tr>
            <th className="py-4 px-4 border-b-2 border-stone-200">サーバ</th>
            <th className="py-4 px-2 border-b-2 border-stone-200">GPU</th>
            <th className="py-4 px-4 border-b-2 border-stone-200">温度</th>
            <th className="py-4 px-4 border-b-2 border-stone-200">計算負荷</th>
            <th className="py-4 px-4 border-b-2 border-stone-200">
              メモリ (GiB)
            </th>
            <th className="py-4 px-4 border-b-2 border-stone-200">利用者</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) =>
            stat.gpus.map((gpu, gpuIndex) => {
              const isLastGpuInHost = gpuIndex === stat.gpus.length - 1;
              const cellClassName = `py-4 px-4 ${
                isLastGpuInHost ? "border-b-2 border-stone-200" : ""
              }`;
              const centeredCellClassName = `${cellClassName} text-center`;
              const displayedGpuName = gpu.name?.replace(
                "Ada Generation",
                "Ada"
              );
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
                      return `${memoryUsedGib} / ${memoryTotalGib}`;
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
