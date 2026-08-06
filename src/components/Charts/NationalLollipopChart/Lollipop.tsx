'use client';

import {
  ActiveElement,
  BarElement,
  CategoryScale,
  ChartData,
  ChartEvent,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  PointElement,
  ScatterController,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import React, { useMemo } from 'react';
import { Chart } from 'react-chartjs-2';
import { COLORS } from '@constants';
import { useBreakpoint } from '@hooks';

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
  loading?: boolean;
  onSelectState?: (stateCode: string) => void;
};

export const Lollipop: React.FC<Props> = ({
  scoresByState,
  className,
  loading = false,
  onSelectState,
}) => {
  const { isMobile } = useBreakpoint();

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
    (): ChartOptions<'bar'> => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: () => '',
            label: (context: TooltipItem<'bar'>) => {
              const stateCode = labels[context.dataIndex];
              const score = context.parsed.y;
              if (score == null) {
                return `${stateCode}: —`;
              }
              return `${stateCode}: ${score.toFixed(2)}`;
            },
          },
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          bodyColor: '#ffffff',
          bodyFont: { weight: 'normal' as const },
          borderColor: COLORS.YELLOW,
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
      onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
        if (loading || !elements?.length || !onSelectState) return;
        const idx = elements[0].index;
        const stateCode = labels[idx];
        if (stateCode) onSelectState(stateCode);
      },
      onHover: (event: ChartEvent, el: ActiveElement[]) => {
        const native = event.native as MouseEvent | null | undefined;
        const target = native?.target as HTMLElement | undefined;
        if (!target) return;
        target.style.cursor = !loading && el?.length ? 'pointer' : 'default';
      },
    }),
    [yMin, yMax, labels, onSelectState, isMobile, loading],
  );

  const data = useMemo((): ChartData<'bar'> => {
    const barDataset = {
      backgroundColor: colors,
      barThickness: 1,
      borderColor: colors,
      borderWidth: 1,
      data: scores,
      type: 'bar' as const,
    };
    const scatterDataset = {
      data: scores.map((d, i) => ({ x: i, y: d })),
      parsing: false as const,
      pointBackgroundColor: COLORS.YELLOW,
      pointBorderColor: COLORS.YELLOW,
      pointBorderWidth: 2,
      pointRadius: isMobile ? 0.5 : 3,
      type: 'scatter' as const,
    };

    // Chart.js mixed bar+scatter; typed as bar for react-chartjs-2 Chart.
    return {
      labels,
      datasets: [barDataset, scatterDataset],
    } as ChartData<'bar'>;
  }, [labels, scores, colors, isMobile]);

  return (
    <div className={className}>
      <div
        aria-label="State scores lollipop chart"
        className="w-full h-full"
        role="img"
        style={{ aspectRatio: '918/582' }}
      >
        <Chart data={data} options={options} type="bar" />
      </div>
    </div>
  );
};

export default Lollipop;
