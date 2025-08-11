'use client';

import React, { useMemo } from 'react';
import {
  COLORS,
  SIGNAL_KEYS,
  SIGNAL_LABELS,
  CHART_OPTIONS,
  CHART_COLORS,
} from '@constants';
import { ChartComponents } from '@types';
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
  components: ChartComponents;
};

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
          backgroundColor: CHART_COLORS.RADAR_BACKGROUND,
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
        <RadarChart data={data} options={CHART_OPTIONS.RADAR} />
      </div>
    </div>
  );
};

export default Radar;
