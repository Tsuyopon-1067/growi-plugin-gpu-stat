import React from "react";
import { growiReact } from "@growi/pluginkit";
import { getColor } from "../lib/gradationColor";

interface VerticalGaugeProps {
  value?: number;
  min?: number;
  max?: number;
  height?: number;
  width?: number;
  animated?: boolean;
}

export const VerticalGauge: React.FC<VerticalGaugeProps> = ({
  value = 50,
  min = 0,
  max = 100,
  height = 200,
  width = 20,
  animated = true,
}) => {
  const growiReactInstance = growiReact(React);
  const { useState, useEffect } = growiReactInstance;

  const [currentValue, setCurrentValue] = useState(value);

  // 値を0-100の範囲に正規化
  const normalizedValue = Math.max(
    0,
    Math.min(100, ((currentValue - min) / (max - min)) * 100)
  );

  const gaugeColor = (normalizedValue: number) => {
    const maxTemperature = 85;
    const gaugeValue = Math.min(100, (normalizedValue / maxTemperature) * 100);
    return getColor(gaugeValue);
  };

  const createGradient = (value: number) => {
    const stops = 15;
    if (value <= 0) {
      return gaugeColor(0);
    }

    const colors = Array.from({ length: stops }, (_, i) => {
      const stepValue = (i / (stops - 1)) * value;
      return gaugeColor(stepValue);
    });

    return `linear-gradient(to top in oklch, ${colors.join(", ")})`;
  };

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        className="relative flex items-start gap-4"
        style={{ height: `${height}px` }}
      >
        {/* ゲージ本体 */}
        <div
          className="relative"
          style={{ width: `${width}px`, height: "100%" }}
        >
          {/* 背景 */}
          <div className="absolute inset-0 bg-gray-200" />

          {/* ゲージの中身 */}
          <div
            className={`absolute bottom-0 left-0 right-0 ${
              animated ? "transition-all duration-500 ease-in-out" : ""
            }`}
            style={{
              height: `${normalizedValue}%`,
              background: createGradient(normalizedValue),
            }}
          />
        </div>

        {/* 目盛り（右外） */}
        <div className="relative h-full">
          {[0, 25, 50, 75, 100].map((tick) => (
            <div
              key={tick}
              className="absolute flex items-center gap-1"
              style={{
                bottom: `${tick}%`,
                transform: "translateY(50%)",
                left: "-12px",
              }}
            >
              <div className="w-3 h-0.5 bg-gray-400" />
              <span className="text-xs text-gray-600 font-medium">
                {Math.round(min + ((max - min) * tick) / 100)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 現在値の表示 */}
      <div className="text-center">
        <div
          className="text-3xl font-bold"
          style={{ color: getColor(normalizedValue) }}
        >
          {currentValue.toFixed(1)}°C
        </div>
      </div>
    </div>
  );
};
