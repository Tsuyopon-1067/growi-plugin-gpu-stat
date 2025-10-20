// models.ts
export interface ProcessInfo {
  username?: string;
  command?: string;
  full_command?: string[];
  gpu_memory_usage?: number;
  cpu_percent?: number;
  cpu_memory_usage?: number;
  pid?: number;
}

export interface GpuInfo {
  index: number;
  uuid?: string;
  name?: string;
  "temperature.gpu"?: number;
  "fan.speed"?: number;
  "utilization.gpu"?: number;
  "utilization.enc"?: number;
  "utilization.dec"?: number;
  "power.draw"?: number;
  "enforced.power.limit"?: number;
  "memory.used"?: number;
  "memory.total"?: number;
  processes?: ProcessInfo[];
}

export interface GpuStat {
  hostname?: string;
  driver_version?: string;
  query_time?: string;
  gpus: GpuInfo[];
}

// gpuStats.ts
export async function fetchGpuStats(url: string): Promise<GpuStat[]> {
  let text: string = '';
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    text = await response.text();

    // 連続するコンマを1つに置換
    text = text.replace(/,{2,}/g, ",");

    // JSONパース
    const stats: GpuStat[] = JSON.parse(text);

    return stats;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Failed to parse JSON after comma fix:", error);
      console.error("Fixed response was:", text);
      throw new Error(`JSON parse error: ${error.message}`);
    }
    throw error;
  }
}

// 使用例
async function main() {
  const url = "https://your-gpu-stats-endpoint.com/api/stats";

  try {
    // ブラウザまたはNode.js (証明書検証あり)
    const stats = await fetchGpuStats(url);
    console.log("GPU Stats:", stats);

    // Node.js環境で自己署名証明書を許可する場合
    // const stats = await fetchGpuStatsNodeJs(url);

    // 各GPUの情報を表示
    stats.forEach((stat, statIndex) => {
      console.log(`\nHost: ${stat.hostname}`);
      console.log(`Driver Version: ${stat.driver_version}`);
      console.log(`Query Time: ${stat.query_time}`);

      stat.gpus.forEach((gpu) => {
        console.log(`\n  GPU ${gpu.index}:`);
        console.log(`    Name: ${gpu.name}`);
        console.log(`    Temperature: ${gpu["temperature.gpu"]}°C`);
        console.log(`    GPU Utilization: ${gpu["utilization.gpu"]}%`);
        console.log(
          `    Memory: ${gpu["memory.used"]}MB / ${gpu["memory.total"]}MB`
        );
        console.log(`    Power Draw: ${gpu["power.draw"]}W`);

        if (gpu.processes && gpu.processes.length > 0) {
          console.log(`    Processes:`);
          gpu.processes.forEach((proc) => {
            console.log(
              `      - User: ${proc.username}, PID: ${proc.pid}, Memory: ${proc.gpu_memory_usage}MB`
            );
          });
        }
      });
    });
  } catch (error) {
    console.error("Error fetching GPU stats:", error);
  }
}
