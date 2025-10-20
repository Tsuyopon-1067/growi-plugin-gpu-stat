// 値に基づいて色を計算（緑→黄→赤のグラデーション）
export const getColor = (val: number): string => {
  const hue = (1 - val / 100) * 160;
  const [h, s, l] = hsvToHsl(hue, 0.85, 0.9);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

const hsvToHsl = (
  h: number,
  s: number,
  v: number
): [number, number, number] => {
  const l = (v * (2 - s)) / 2;
  const sNew = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  return [h, sNew * 100, l * 100];
};
