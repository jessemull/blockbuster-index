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
  scoresByState: Record<string, number>;
  className?: string;
  onSelectRegion?: (regionName: string, average: number) => void;
};

// options built dynamically to allow non-zero baseline

export const RegionalBars: React.FC<Props> = ({
  scoresByState,
  className,
  onSelectRegion,
}) => {
  const { labels, values } = useMemo(() => {
    // U.S. Census Bureau divisions (9)
    const DIVISIONS: Record<string, string[]> = {
      'New England': ['CT', 'ME', 'MA', 'NH', 'RI', 'VT'],
      'Mid-Atlantic': ['NJ', 'NY', 'PA'],
      'East North Central': ['IL', 'IN', 'MI', 'OH', 'WI'],
      'West North Central': ['IA', 'KS', 'MN', 'MO', 'NE', 'ND', 'SD'],
      'South Atlantic': ['DE', 'FL', 'GA', 'MD', 'NC', 'SC', 'VA', 'DC', 'WV'],
      'East South Central': ['AL', 'KY', 'MS', 'TN'],
      'West South Central': ['AR', 'LA', 'OK', 'TX'],
      Mountain: ['AZ', 'CO', 'ID', 'MT', 'NV', 'NM', 'UT', 'WY'],
      Pacific: ['AK', 'CA', 'HI', 'OR', 'WA'],
    };

    const entries = Object.entries(DIVISIONS).map(([name, states]) => {
      const vals = states
        .map((s) => scoresByState[s])
        .filter((n) => typeof n === 'number') as number[];
      const avg = vals.length
        ? Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))
        : 0;
      return { name, avg };
    });

    entries.sort((a, b) => b.avg - a.avg);
    return {
      labels: entries.map((e) => e.name),
      values: entries.map((e) => e.avg),
    };
  }, [scoresByState]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Average score by region',
          data: values,
          backgroundColor: 'rgba(244, 221, 50, 0.35)',
          borderColor: COLORS.YELLOW,
          borderWidth: {
            top: 2,
            left: 2,
            right: 2,
            bottom: 0,
          } as any,
          borderSkipped: 'bottom' as const,
          borderRadius: {
            topLeft: 6,
            topRight: 6,
            bottomLeft: 0,
            bottomRight: 0,
          } as any,
        },
      ],
    }),
    [labels, values],
  );

  const [minY, maxY] = useMemo(() => {
    if (!values.length) return [0, 100];
    const vmin = Math.min(...values);
    const vmax = Math.max(...values);
    const range = Math.max(5, vmax - vmin);
    const pad = range * 0.2;
    const min = Math.max(0, Math.floor((vmin - pad) / 5) * 5);
    const max = Math.min(100, Math.ceil((vmax + pad) / 5) * 5);
    return [min, max];
  }, [values]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index' as const },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.1)' },
          ticks: {
            color: '#ffffff',
            minRotation: 25,
            maxRotation: 25,
            font: { size: 10 },
          },
        },
        y: {
          min: minY,
          max: maxY,
          grid: { color: 'rgba(255,255,255,0.1)' },
          ticks: { color: '#ffffff' },
        },
      },
      onClick: (_: any, elements: any[]) => {
        if (!elements?.length || !onSelectRegion) return;
        const idx = elements[0].index ?? elements[0]._index;
        const name = labels[idx];
        const avg = values[idx];
        if (name) onSelectRegion(name, avg);
      },
      onHover: (event: any, el: any[]) => {
        const target = event?.native?.target as HTMLElement | undefined;
        if (!target) return;
        target.style.cursor = el?.length ? 'pointer' : 'default';
      },
    }),
    [minY, maxY, labels, values, onSelectRegion],
  );

  return (
    <div className={className}>
      <div className="w-full h-full" style={{ aspectRatio: '918/582' }}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default RegionalBars;
