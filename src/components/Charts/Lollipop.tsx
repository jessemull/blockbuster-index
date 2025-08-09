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

const options = {
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
      min: 0,
      max: 100,
      grid: { color: 'rgba(255,255,255,0.1)' },
      ticks: { color: '#ffffff' },
    },
  },
} as const;

export const Lollipop: React.FC<Props> = ({ scoresByState, className }) => {
  const { labels, scores, colors } = useMemo(() => {
    const entries = Object.entries(scoresByState).sort((a, b) => b[1] - a[1]);
    const lbls = entries.map(([code]) => code);
    const ds = entries.map(([, score]) => score ?? 0);
    const cs = ds.map(() => COLORS.YELLOW);
    return { labels: lbls, scores: ds, colors: cs };
  }, [scoresByState]);

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
      <div className="text-center text-[#f4dd32] font-semibold mb-4">
        State Scores (Lollipop)
      </div>
      <div className="w-full h-full" style={{ aspectRatio: '918/582' }}>
        <Chart type="bar" data={data as any} options={options} />
      </div>
    </div>
  );
};

export default Lollipop;
