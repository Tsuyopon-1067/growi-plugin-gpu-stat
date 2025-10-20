import React, { useId } from "react";
import { getColor } from "../lib/gradationColor";

type CircularGaugeProps = {
  value?: number;
  min?: number;
  max?: number;
  startAngle?: number;
  endAngle?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
  unit?: string;
  showTicks?: boolean;
  tickCount?: number;
  colors?: (value: number) => string;
};

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value = 75,
  min = 0,
  max = 100,
  startAngle = -135,
  endAngle = 135,
  size = 250,
  strokeWidth = 20,
  label = "Performance",
  subLabel,
  unit = "%",
  showTicks = true,
  tickCount = 10,
  colors = getColor,
}) => {
  const uniqueId = useId();
  const gradientId = `gaugeGradient-${uniqueId}`;
  const shadowId = `shadow-${uniqueId}`;

  // 値を0-100の範囲に正規化
  const normalizedValue = Math.max(min, Math.min(max, value));
  const percentage = ((normalizedValue - min) / (max - min)) * 100;

  // 角度の計算
  const angleRange = endAngle - startAngle;
  const valueAngle = startAngle + (angleRange * percentage) / 100;

  // 中心点とサイズ計算
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const innerRadius = radius - strokeWidth;

  const totalArcLength = (angleRange / 360) * 2 * Math.PI * radius;
  const strokeDashoffset = totalArcLength * (1 - percentage / 100);

  // パスの描画用の極座標から直交座標への変換
  const polarToCartesian = (angle: number, r = radius) => {
    const angleInRadians = ((angle - 90) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(angleInRadians),
      y: center + r * Math.sin(angleInRadians),
    };
  };

  // 背景の円弧パス
  const createArcPath = (start: number, end: number, r = radius) => {
    const startPoint = polarToCartesian(start, r);
    const endPoint = polarToCartesian(end, r);
    const largeArcFlag = end - start <= 180 ? "0" : "1";
    return `M ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${endPoint.x} ${endPoint.y}`;
  };

  // メモリ（ティック）の生成
  const generateTicks = () => {
    if (!showTicks) return [];
    const ticks = [];
    for (let i = 0; i <= tickCount; i++) {
      const angle = startAngle + (angleRange * i) / tickCount;
      const startPoint = polarToCartesian(angle, radius + 5);
      const endPoint = polarToCartesian(angle, radius + 15);
      const textPoint = polarToCartesian(angle, radius + 25);
      const tickValue = min + ((max - min) * i) / tickCount;

      ticks.push(
        <g key={`tick-${i}`}>
          <line
            x1={startPoint.x}
            y1={startPoint.y}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <text
            x={textPoint.x}
            y={textPoint.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-slate-600"
          >
            {Math.round(tickValue)}
          </text>
        </g>
      );
    }
    return ticks;
  };

  const gaugeColor = colors(percentage);

  return (
    <div className="flex flex-col items-center py-6 px-8">
      <svg
        width={size}
        height={size}
        className="transform -rotate-0"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* ゲージのグラデーション */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={gaugeColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={gaugeColor} stopOpacity="1" />
          </linearGradient>

          {/* ドロップシャドウ */}
          <filter id={shadowId}>
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* メモリ */}
        {generateTicks()}

        {/* 背景の円弧 */}
        <path
          d={createArcPath(startAngle, endAngle)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* 値を示す円弧 */}
        <path
          d={createArcPath(startAngle, endAngle)}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          filter={`url(#${shadowId})`}
          strokeDasharray={totalArcLength}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* 中央のテキスト */}
        <text
          x={center}
          y={center - (subLabel ? 20 : 10)}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-4xl font-bold fill-slate-800"
        >
          {normalizedValue.toFixed(1)}
          <tspan className="text-2xl fill-slate-600">{unit}</tspan>
        </text>

        {subLabel && (
          <text
            x={center}
            y={center + 15}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xl font-bold fill-slate-500"
          >
            {subLabel}
          </text>
        )}

        <text
          x={center}
          y={center + (subLabel ? 40 : 20)}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm fill-slate-500"
        >
          {label}
        </text>
      </svg>
    </div>
  );
};
