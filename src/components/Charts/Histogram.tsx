'use client';

import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { COLORS } from '@constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  scores: number[];
  className?: string;
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { mode: 'index' as const } },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.1)' },
      ticks: { color: '#ffffff' },
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.1)' },
      ticks: { color: '#ffffff' },
    },
  },
} as const;

export const Histogram: React.FC<Props> = ({ scores, className }) => {
  const { labels, values } = useMemo(() => {
    // Region groupings (U.S. Census Bureau regions)
    const REGIONS: Record<string, string[]> = {
      Northeast: ['CT', 'ME', 'MA', 'NH', 'RI', 'VT', 'NJ', 'NY', 'PA'],
      Midwest: [
        'IL',
        'IN',
        'MI',
        'OH',
        'WI',
        'IA',
        'KS',
        'MN',
        'MO',
        'NE',
        'ND',
        'SD',
      ],
      South: [
        'DE',
        'FL',
        'GA',
        'MD',
        'NC',
        'SC',
        'VA',
        'DC',
        'WV',
        'AL',
        'KY',
        'MS',
        'TN',
        'AR',
        'LA',
        'OK',
        'TX',
      ],
      West: [
        'AZ',
        'CO',
        'ID',
        'MT',
        'NV',
        'NM',
        'UT',
        'WY',
        'AK',
        'CA',
        'HI',
        'OR',
        'WA',
      ],
    };

    // Expect scores array aligned to states order not provided; instead caller should supply state-by-state.
    // For our usage we will compute region averages outside or pass via scores map. To keep this component
    // focused, we allow scores to be any values already aggregated per region.
    // Here we simulate 4 bins by splitting equally if length===4.
    const names = Object.keys(REGIONS);
    const vals = names.map((_, i) => scores[i] ?? 0);
    return { labels: names, values: vals };
  }, [scores]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Average score by region',
          data: values,
          backgroundColor: 'rgba(244, 221, 50, 0.35)',
          borderColor: COLORS.YELLOW,
        },
      ],
    }),
    [labels, values],
  );

  return (
    <div className={className}>
      <div className="text-center text-[#f4dd32] font-semibold mb-4">
        Regional Averages
      </div>
      <div className="w-full h-full" style={{ aspectRatio: '918/582' }}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default Histogram;
