'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { COLORS } from '@constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
);

type Props = {
  scoresByState: Record<string, number>;
  className?: string;
};

// options constructed dynamically inside component to set y-axis max

export const Lollipop: React.FC<Props> = ({ scoresByState, className }) => {
  const { labels, scores, colors } = useMemo(() => {
    const entries = Object.entries(scoresByState).sort((a, b) => b[1] - a[1]);
    const lbls = entries.map(([code]) => code);
    const ds = entries.map(([, score]) => score ?? 0);
    const cs = ds.map(() => COLORS.YELLOW);
    return { labels: lbls, scores: ds, colors: cs };
  }, [scoresByState]);

  const { yMin, yMax } = useMemo(() => {
    if (!scores.length) {
      return { yMin: 0, yMax: 100 };
    }
    const maxVal = Math.max(...scores);
    const minVal = Math.min(...scores);
    const roundedMax = Math.ceil(maxVal / 10) * 10;
    const range = Math.max(5, maxVal - minVal);
    const pad = range * 0.2;
    let min = Math.floor((minVal - pad) / 5) * 5;
    min = Math.max(1, min); // avoid zero to maximize visible variation
    let max = Math.min(100, Math.max(10, roundedMax));
    if (max <= min) {
      max = min + 5;
    }
    return { yMin: min, yMax: max };
  }, [scores]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0)' },
          ticks: {
            color: '#ffffff',
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90,
            font: { size: 9 },
          },
        },
        y: {
          min: yMin,
          max: yMax,
          grid: { color: 'rgba(255,255,255,0.1)' },
          ticks: { color: '#ffffff' },
        },
      },
    }),
    [yMin, yMax],
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          type: 'bar' as const,
          data: scores,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1,
          barThickness: 1,
        },
        {
          type: 'scatter' as const,
          data: scores.map((d, i) => ({ x: i, y: d })),
          parsing: false,
          pointBackgroundColor: COLORS.YELLOW,
          pointBorderColor: COLORS.YELLOW,
          pointBorderWidth: 2,
          pointRadius: 3,
        },
      ],
    }),
    [labels, scores, colors],
  );

  return (
    <div className={className}>
      <div className="w-full h-full" style={{ aspectRatio: '918/582' }}>
        <Chart type="bar" data={data as any} options={options} />
      </div>
    </div>
  );
};

export default Lollipop;
