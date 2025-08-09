'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { COLORS, SIGNAL_KEYS, SIGNAL_LABELS } from '@constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  components: Record<string, number>;
  title?: string;
};

const options = {
  indexAxis: 'y' as const,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.1)' },
      ticks: { color: '#ffffff' },
    },
    y: { grid: { color: 'rgba(255,255,255,0)' }, ticks: { color: '#ffffff' } },
  },
} as const;

export const Bars: React.FC<Props> = ({
  components,
  title = 'Signal Scores',
}) => {
  const barsSorted = useMemo(
    () =>
      SIGNAL_KEYS.map((k) => ({
        label: SIGNAL_LABELS[k] || k,
        value: components[k] ?? 0,
      })).sort((a, b) => b.value - a.value),
    [components],
  );

  const data = useMemo(
    () => ({
      labels: barsSorted.map((b) => b.label),
      datasets: [
        {
          label: 'Signal Score',
          data: barsSorted.map((b) => b.value),
          backgroundColor: 'rgba(244, 221, 50, 0.35)',
          borderColor: COLORS.YELLOW,
        },
      ],
    }),
    [barsSorted],
  );

  return (
    <div>
      <div className="text-center text-[#f4dd32] font-semibold mb-4">
        {title}
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Bars;
