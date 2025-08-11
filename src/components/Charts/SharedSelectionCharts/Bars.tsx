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
import {
  COLORS,
  SIGNAL_KEYS,
  SIGNAL_LABELS,
  CHART_OPTIONS,
  CHART_COLORS,
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
      <div className="text-center text-[#f4dd32] font-semibold mb-4">
        {title}
      </div>
      <Bar data={data} options={CHART_OPTIONS.BAR} />
    </div>
  );
};

export default Bars;
