import { ProcessInfo } from "../lib/models";

interface GPUProcessListProps {
  processes?: ProcessInfo[];
}

export const GPUProcessList: React.FC<GPUProcessListProps> = ({
  processes,
}) => {
  const formatMemory = (memoryBytes?: number): string => {
    if (!memoryBytes) return "N/A";
    return (memoryBytes / 1024).toFixed(1);
  };

  const processText = processes
    ?.map(
      (p) =>
        `${p.username || "Unknown"} (${formatMemory(p.gpu_memory_usage)}GB)`
    )
    .join(", ");

  return (
    <div className="flex flex-col min-w-[160px]">
      <div className="px-4 py-1 mb-2 text-sm font-semibold text-gray-600 uppercase tracking-wide">
        Processes
      </div>
      <div className="px-4 py-2 ml-2 mb-3 text-xs flex-1 border-l-2 border-gray-300 box-border">
        {processText}
      </div>
    </div>
  );
};
