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
import { useBlockbusterData } from '@providers';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type Props = {
  className?: string;
  onSelectRegion?: (regionName: string, average: number) => void;
};

export const RegionalBars: React.FC<Props> = ({
  className,
  onSelectRegion,
}) => {
  const { regionAverages } = useBlockbusterData();

  const { labels, values } = useMemo(() => {
    const entries = (regionAverages || []).slice();
    return {
      labels: entries.map((e) => e.name),
      values: entries.map((e) => e.avg),
    };
  }, [regionAverages]);

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          backgroundColor: 'rgba(244, 221, 50, 0.35)',
          borderColor: COLORS.YELLOW,
          data: values,
          label: 'Average score by region',
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
        tooltip: {
          callbacks: {
            title: () => '',
            label: (context: any) => {
              const regionName = labels[context.dataIndex];
              const score = context.parsed.y;
              return `${regionName}: ${score.toFixed(2)}`;
            },
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          bodyColor: '#ffffff',
          borderColor: '#f4dd32',
          borderWidth: 1,
          displayColors: false,
          padding: 8,
          titleColor: '#ffffff',
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.1)' },
          ticks: {
            color: '#ffffff',
            font: { size: 10 },
            maxRotation: 45,
            minRotation: 0,
            padding: 8,
          },
          afterFit: (axis: any) => {
            axis.paddingBottom = 20;
          },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.1)' },
          max: maxY,
          min: minY,
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
