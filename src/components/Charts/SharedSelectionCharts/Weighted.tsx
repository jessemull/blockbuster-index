'use client';

import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  COLORS,
  SIGNAL_KEYS,
  SIGNAL_LABELS,
  SIGNAL_WEIGHTS,
  CHART_OPTIONS,
  CHART_COLORS,
} from '@constants';
import { ChartComponents } from '@types';
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
  components: ChartComponents;
};

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

  const data = useMemo(
    () => ({
      labels: weighted.map((p) => p.label),
      datasets: [
        {
          label: 'Weighted Contribution (score × weight)',
          data: weighted.map((p) => p.amount),
          backgroundColor: CHART_COLORS.BAR_BACKGROUND,
          borderColor: COLORS.YELLOW,
        },
      ],
    }),
    [weighted],
  );

  return (
    <div>
      <div className="text-center text-[#f4dd32] font-semibold mb-4">
        Signal Contributions
      </div>
      <Bar data={data} options={CHART_OPTIONS.BAR} />
    </div>
  );
};

export default Weighted;
