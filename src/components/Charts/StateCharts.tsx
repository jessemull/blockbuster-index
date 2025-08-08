'use client';

import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
} from 'chart.js';
import { Radar, Bar, Doughnut } from 'react-chartjs-2';
import { COLORS, SIGNAL_WEIGHTS, SIGNAL_LABELS } from '@constants';
import { BlockbusterData } from '@types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
);

type Props = {
  stateCode: string;
  data: BlockbusterData;
};

const SIGNAL_KEYS = [
  'AMAZON',
  'BLS_ECOMMERCE',
  'BROADBAND',
  'WALMART',
  'CENSUS',
  'BLS_PHYSICAL',
];

export const StateCharts: React.FC<Props> = ({ stateCode, data }) => {
  const state = data.states[stateCode];
  const components = state.components || {};

  const labels = SIGNAL_KEYS.map((k) => SIGNAL_LABELS[k] || k);
  const values = SIGNAL_KEYS.map((k) => components[k] ?? 0);

  const weightedContrib = useMemo(() => {
    const items = SIGNAL_KEYS.map((k) => ({
      key: k,
      label: SIGNAL_LABELS[k] || k,
      weight: SIGNAL_WEIGHTS[k] || 0,
      value: components[k] ?? 0,
    }));
    const products = items.map((i) => ({
      label: i.label,
      amount: Number((i.value * i.weight).toFixed(2)),
    }));
    products.sort((a, b) => b.amount - a.amount);
    return products;
  }, [components]);

  const radarData = {
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
  };
  const radarOptions = {
    plugins: {
      legend: { display: false },
    },
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.1)' },
        grid: { color: 'rgba(255,255,255,0.15)' },
        pointLabels: { color: '#ffffff', font: { size: 12 } },
        ticks: { display: false },
      },
    },
  } as const;

  const barsSorted = useMemo(() => {
    return SIGNAL_KEYS.map((k) => ({
      label: SIGNAL_LABELS[k] || k,
      value: components[k] ?? 0,
    })).sort((a, b) => b.value - a.value);
  }, [components]);

  const barData = {
    labels: barsSorted.map((b) => b.label),
    datasets: [
      {
        label: 'Signal Score',
        data: barsSorted.map((b) => b.value),
        backgroundColor: 'rgba(244, 221, 50, 0.35)',
        borderColor: COLORS.YELLOW,
      },
    ],
  };
  const horizontalBarOptions = {
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: '#ffffff' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0)' },
        ticks: { color: '#ffffff' },
      },
    },
  } as const;

  const weightBarData = {
    labels: weightedContrib.map((p) => p.label),
    datasets: [
      {
        label: 'Weighted Contribution (score × weight)',
        data: weightedContrib.map((p) => p.amount),
        backgroundColor: 'rgba(244, 221, 50, 0.35)',
        borderColor: COLORS.YELLOW,
      },
    ],
  };

  const donutData = {
    labels: ['Blockbuster Index', 'Remaining to 100'],
    datasets: [
      {
        data: [state.score, Math.max(0, 100 - state.score)],
        backgroundColor: [COLORS.YELLOW, 'rgba(244, 221, 50, 0.15)'],
        borderColor: [COLORS.YELLOW, COLORS.DARK_BLUE],
      },
    ],
  };
  const donutOptions = {
    plugins: { legend: { display: false } },
  } as const;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
      <div className="p-0">
        <div className="text-center text-[#f4dd32] font-semibold mb-3">
          Signal Composition
        </div>
        <Radar data={radarData} options={radarOptions} />
      </div>
      <div className="p-0">
        <div className="text-center text-[#f4dd32] font-semibold mb-3">
          Signal Scores
        </div>
        <Bar data={barData} options={horizontalBarOptions} />
      </div>
      <div className="p-0">
        <div className="text-center text-[#f4dd32] font-semibold mb-3">
          Weighted Contributions
        </div>
        <Bar data={weightBarData} options={horizontalBarOptions} />
      </div>
      <div className="p-0 flex flex-col items-center">
        <div className="text-center text-[#f4dd32] font-semibold mb-3">
          Blockbuster Index
        </div>
        <div className="w-48">
          <Doughnut data={donutData} options={donutOptions} />
        </div>
      </div>
    </div>
  );
};

export default StateCharts;
