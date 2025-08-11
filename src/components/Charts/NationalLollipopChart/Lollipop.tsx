'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  ScatterController,
  Tooltip,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { COLORS } from '@constants';

ChartJS.register(
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  PointElement,
  ScatterController,
  Tooltip,
);

type Props = {
  scoresByState: Record<string, number>;
  className?: string;
  onSelectState?: (stateCode: string) => void;
};

export const Lollipop: React.FC<Props> = ({
  scoresByState,
  className,
  onSelectState,
}) => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { labels, scores, colors } = useMemo(() => {
    const entries = Object.entries(scoresByState).sort((a, b) => b[1] - a[1]);
    const lbls = entries.map(([code]) => code);
    const ds = entries.map(([, score]) => score ?? 0);
    const cs = ds.map(() => COLORS.YELLOW);
    return { labels: lbls, scores: ds, colors: cs };
  }, [scoresByState]);

  const { yMin, yMax } = useMemo(() => {
    if (!scores.length) {
      return { yMin: 0, yMax: 100 };
    }
    const maxVal = Math.max(...scores);
    const minVal = Math.min(...scores);
    const roundedMax = Math.ceil(maxVal / 10) * 10;
    const range = Math.max(5, maxVal - minVal);
    const pad = range * 0.2;
    let min = Math.floor((minVal - pad) / 5) * 5;
    min = Math.max(1, min);
    let max = Math.min(100, Math.max(10, roundedMax));
    if (max <= min) {
      max = min + 5;
    }
    return { yMin: min, yMax: max };
  }, [scores]);

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
              const stateCode = labels[context.dataIndex];
              const score = context.parsed.y;
              return `${stateCode}: ${score.toFixed(2)}`;
            },
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          bodyColor: '#ffffff',
          bodyFont: { weight: 'normal' as const },
          borderColor: '#f4dd32',
          borderWidth: 1,
          displayColors: false,
          padding: 8,
          titleColor: '#ffffff',
          titleFont: { weight: 'bold' as const },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0)' },
          ticks: {
            autoSkip: false,
            color: '#ffffff',
            display: !isMobile,
            font: { size: 9 },
            maxRotation: 90,
            minRotation: 90,
          },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.1)' },
          max: yMax,
          min: yMin,
          ticks: { color: '#ffffff' },
        },
      },
      onClick: (_: any, elements: any[]) => {
        if (!elements?.length || !onSelectState) return;
        const idx = elements[0].index ?? elements[0]._index;
        const stateCode = labels[idx];
        if (stateCode) onSelectState(stateCode);
      },
      onHover: (event: any, el: any[]) => {
        const target = event?.native?.target as HTMLElement | undefined;
        if (!target) return;
        target.style.cursor = el?.length ? 'pointer' : 'default';
      },
    }),
    [yMin, yMax, labels, onSelectState, isMobile],
  );

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          backgroundColor: colors,
          barThickness: 1,
          borderColor: colors,
          borderWidth: 1,
          data: scores,
          type: 'bar' as const,
        },
        {
          data: scores.map((d, i) => ({ x: i, y: d })),
          parsing: false,
          pointBackgroundColor: COLORS.YELLOW,
          pointBorderColor: COLORS.YELLOW,
          pointBorderWidth: 2,
          pointRadius: isMobile ? 0.5 : 3,
          type: 'scatter' as const,
        },
      ],
    }),
    [labels, scores, colors, isMobile],
  );

  return (
    <div className={className}>
      <div className="w-full h-full" style={{ aspectRatio: '918/582' }}>
        <Chart type="bar" data={data as any} options={options} />
      </div>
    </div>
  );
};

export default Lollipop;
