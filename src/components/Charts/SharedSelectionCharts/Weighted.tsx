'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import React, { useId, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  CHART_COLORS,
  CHART_OPTIONS,
  COLORS,
  SIGNAL_KEYS,
  SIGNAL_LABELS,
  SIGNAL_WEIGHTS,
} from '@constants';
import { ChartComponents } from '@types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  components: ChartComponents;
};

export const Weighted: React.FC<Props> = ({ components }) => {
  const titleId = useId();
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
      <div
        className="text-center text-brand-yellow font-semibold mb-4"
        id={titleId}
      >
        Signal Contributions
      </div>
      <div aria-labelledby={titleId} role="img">
        <Bar data={data} options={CHART_OPTIONS.BAR} />
      </div>
    </div>
  );
};

export default Weighted;
