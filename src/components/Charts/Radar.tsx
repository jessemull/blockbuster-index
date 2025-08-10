'use client';

import React, { useMemo } from 'react';
import { COLORS, SIGNAL_KEYS, SIGNAL_LABELS } from '@constants';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar as RadarChart } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

type Props = {
  components: Record<string, number>;
};

const radarOptions = {
  maintainAspectRatio: false,
  layout: { padding: 0 },
  plugins: { legend: { display: false } },
  scales: {
    r: {
      angleLines: { color: 'rgba(255,255,255,0.1)' },
      grid: { color: 'rgba(255,255,255,0.15)' },
      pointLabels: { color: '#ffffff', font: { size: 12 }, padding: 0 },
      ticks: { display: false },
    },
  },
} as const;

export const Radar: React.FC<Props> = ({ components }) => {
  const labels = useMemo(
    () => SIGNAL_KEYS.map((k) => SIGNAL_LABELS[k] || k),
    [],
  );

  const values = useMemo(
    () => SIGNAL_KEYS.map((k) => components[k] ?? 0),
    [components],
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Signal Scores (0–100)',
          data: values,
          backgroundColor: 'rgba(244, 221, 50, 0.15)',
          borderColor: COLORS.YELLOW,
          pointBackgroundColor: COLORS.YELLOW,
        },
      ],
    }),
    [labels, values],
  );
  return (
    <div>
      <div className="text-center text-[#f4dd32] font-semibold mb-4">
        Signal Composition
      </div>
      <div className="h-39">
        <RadarChart data={data} options={radarOptions} />
      </div>
    </div>
  );
};

export default Radar;
