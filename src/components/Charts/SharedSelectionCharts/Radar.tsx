'use client';

import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import React, { useId, useMemo } from 'react';
import { Radar as RadarChart } from 'react-chartjs-2';
import {
  CHART_COLORS,
  CHART_OPTIONS,
  COLORS,
  SIGNAL_KEYS,
  SIGNAL_LABELS,
} from '@constants';
import { ChartComponents } from '@types';

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
  const titleId = useId();
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
      <div
        className="text-center text-brand-yellow font-semibold mb-4"
        id={titleId}
      >
        Signal Composition
      </div>
      <div aria-labelledby={titleId} className="h-39" role="img">
        <RadarChart data={data} options={CHART_OPTIONS.RADAR} />
      </div>
    </div>
  );
};

export default Radar;
