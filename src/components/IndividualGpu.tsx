import { GpuInfo } from "../lib/models";
import { CircularGauge } from "./CircularGauge";
import { GPUProcessList } from "./GPUProcessList";
import styles from "./IndividualGpu.module.css";
import { VerticalGauge } from "./VerticalGauge";

interface IndividualGpuProps {
  gpu: GpuInfo;
}

export function IndividualGpu({ gpu }: IndividualGpuProps) {
  const gpuUtlization = gpu["utilization.gpu"] ?? 0;
  const memoryUsed = gpu["memory.used"] ?? 0;
  const memoryTotal = gpu["memory.total"] ?? 0;
  const gpuTemperature = gpu["temperature.gpu"] ?? 0;
  const powerDraw = gpu["power.draw"] ?? 0;
  const memoryTotalGib = (memoryTotal / 1024).toFixed(1);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.gpuName}>
          GPU {gpu.index}: {gpu.name} | {memoryTotalGib} GiB
        </h3>
      </div>
      <div className={styles.gauges}>
        <div />
        <VerticalGauge value={gpuTemperature} max={100} height={130} />
        <div />
        <CircularGauge
          value={gpuUtlization}
          subLabel={powerDraw.toString()}
          label="Utilization"
          unit="%"
        />
        <div />
        <CircularGauge
          value={memoryUsed / 1024}
          max={memoryTotal / 1024}
          label="Memory"
          unit="GiB"
        />
        <div />
        <GPUProcessList processes={gpu.processes} />
        <div />
      </div>
    </div>
  );
}
