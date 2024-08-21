import { type JSX } from 'solid-js';

export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const randomColors = [
  'rgba(255, 99, 132, 0.7)', // Red
  'rgba(54, 162, 235, 0.7)', // Blue
  'rgba(255, 206, 86, 0.7)', // Yellow
  'rgba(75, 192, 192, 0.7)', // Teal
  'rgba(153, 102, 255, 0.7)', // Purple
  'rgba(255, 159, 64, 0.7)', // Orange
  'rgba(100, 149, 237, 0.7)', // Cornflower Blue
  'rgba(144, 238, 144, 0.7)', // Light Green
  'rgba(255, 182, 193, 0.7)', // Light Pink
  'rgba(70, 130, 180, 0.7)', // Steel Blue
  'rgba(255, 105, 180, 0.7)', // Hot Pink
  'rgba(173, 216, 230, 0.7)', // Light Blue
  'rgba(240, 230, 140, 0.7)', // Khaki
  'rgba(32, 178, 170, 0.7)', // Light Sea Green
  'rgba(135, 206, 235, 0.7)', // Sky Blue
  'rgba(250, 128, 114, 0.7)', // Salmon
  'rgba(216, 191, 216, 0.7)', // Thistle
  'rgba(176, 224, 230, 0.7)', // Powder Blue
  'rgba(255, 228, 225, 0.7)', // Misty Rose
  'rgba(152, 251, 152, 0.7)', // Pale Green
  'rgba(176, 196, 222, 0.7)', // Light Steel Blue
  'rgba(238, 130, 238, 0.7)', // Violet
  'rgba(218, 112, 214, 0.7)', // Orchid
  'rgba(147, 112, 219, 0.7)', // Medium Purple
  'rgba(186, 85, 211, 0.7)', // Medium Orchid
  'rgba(221, 160, 221, 0.7)', // Plum
  'rgba(138, 43, 226, 0.7)', // Blue Violet
  'rgba(75, 0, 130, 0.7)', // Indigo
  'rgba(72, 61, 139, 0.7)', // Dark Slate Blue
  'rgba(123, 104, 238, 0.7)', // Medium Slate Blue
];

export const addDecimalPoint = (
  value: string,
  decimalPosition: number,
): string => {
  const length = value.length;
  if (decimalPosition >= length) {
    return '0.' + '0'.repeat(decimalPosition - length) + value;
  } else {
    return (
      value.slice(0, length - decimalPosition) +
      '.' +
      value.slice(length - decimalPosition)
    );
  }
};

export const fallback = (): JSX.Element => {
  return (
    <div class="tw-w-full tw-h-full tw-flex tw-items-center tw-justify-center">
      <p>Chart is not available</p>
    </div>
  );
};
