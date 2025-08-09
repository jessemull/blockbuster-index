'use client';

import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { COLORS, SIGNAL_KEYS, SIGNAL_LABELS, SIGNAL_WEIGHTS } from '@constants';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  components: Record<string, number>;
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

export const Weighted: React.FC<Props> = ({ components }) => {
  const weighted = useMemo(() => {
    const items = SIGNAL_KEYS.map((k) => ({
      label: SIGNAL_LABELS[k] || k,
      amount: Number(
        ((components[k] ?? 0) * (SIGNAL_WEIGHTS[k] || 0)).toFixed(2),
      ),
    }));
    return items.sort((a, b) => b.amount - a.amount);
  }, [components]);

  const data = {
    labels: weighted.map((p) => p.label),
    datasets: [
      {
        label: 'Weighted Contribution (score × weight)',
        data: weighted.map((p) => p.amount),
        backgroundColor: 'rgba(244, 221, 50, 0.35)',
        borderColor: COLORS.YELLOW,
      },
    ],
  };

  return (
    <div>
      <div className="text-center text-[#f4dd32] font-semibold mb-4">
        Signal Contributions
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Weighted;
