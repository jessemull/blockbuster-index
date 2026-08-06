'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  CHART_COLORS,
  CHART_OPTIONS,
  COLORS,
  SIGNAL_KEYS,
  SIGNAL_LABELS,
} from '@constants';
import { ChartComponents } from '@types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  components: ChartComponents;
  title?: string;
};

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
          backgroundColor: CHART_COLORS.BAR_BACKGROUND,
          borderColor: COLORS.YELLOW,
        },
      ],
    }),
    [barsSorted],
  );

  return (
    <div>
      <div className="text-center text-brand-yellow font-semibold mb-4">
        {title}
      </div>
      <Bar data={data} options={CHART_OPTIONS.BAR} />
    </div>
  );
};

export default Bars;
