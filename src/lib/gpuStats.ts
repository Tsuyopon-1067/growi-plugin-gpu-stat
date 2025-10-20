import type { GpuStat } from "./models";

export interface GpuStatsResponse {
  stats: GpuStat[];
  lastModified: string | null;
}

export async function fetchGpuStats(url: string): Promise<GpuStatsResponse> {
  let text = "";
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const lastModified = response.headers.get("Last-Modified");

    text = await response.text();

    // Replace consecutive commas with a single comma
    text = text.replace(/,{2,}/g, ",");

    // JSON parse
    const stats: GpuStat[] = JSON.parse(text);

    return { stats, lastModified };
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Failed to parse JSON after comma fix:", error);
      console.error("Fixed response was:", text);
      throw new Error(`JSON parse error: ${error.message}`);
    }
    throw error;
  }
}